import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { isValidScheduledDate } from '../common/utils/isValidScheduledDate';
import { ScheduledReminder } from './dto/scheduled-reminders.response.dto';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReminderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  private readonly scheduledReminderTimeLimit = this.configService.get<number>(
    'TIME_INTERVAL_IN_MINUTES_TO_FETCH_SCHEDULED_REMINDERS',
  );
  private readonly offset = -3 * 60 * 60 * 1000; // -3 horas em milissegundos

  public async getReminderById(id: string) {
    const reminder = await this.prismaService.reminder.findUnique({
      where: { id: id },
      include: {
        usersToReminder: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                channel: true,
              },
            },
          },
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Não foi possível encontrar o lembrete');
    }

    return reminder;
  }

  public async getUserReminders(userId: string) {
    return await this.prismaService.reminder.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        usersToReminder: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                channel: true,
              },
            },
          },
        },
      },
    });
  }

  // Busca os lembretes agendados nos últimos 30min [0'-29'] agrupando por horário e pelo canal [Ex.: 2024-09-10T16:16:00.000Z_EMAIL]
  public async getScheduledRemindersWithinNextThirtyMinutes() {
    const now = new Date().setSeconds(0, 0);
    const minutesLater = new Date(
      now + (this.scheduledReminderTimeLimit - 1) * 60 * 1000,
    ); // 29 minutos à frente

    // Ajuste manual para o fuso horário de Brasília (UTC-3)
    const nowWithoutOffset = new Date(now + this.offset);
    const minutesLaterWithoutOffset = new Date(
      minutesLater.getTime() + this.offset,
    );

    const nowFormatted = Math.floor(nowWithoutOffset.getTime() / 1000);
    const minutesLaterFormatted = Math.floor(
      minutesLaterWithoutOffset.getTime(),
    );

    const scheduledReminders: ScheduledReminder[] = await this.prismaService
      .$queryRaw`
      SELECT
        r.scheduled,
        c.channel,
        COUNT(utr.id) AS reminders_count,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', utr.id,
            'reminder_id', utr."reminderId",
            'reminder_title', r.title,
            'reminder_description', r.description,
            'reminder_status', utr.status,
            'reminder_created_at', utr."createdAt",
            'reminder_scheduled', r.scheduled,
            'contact_id', utr."contactId",
            'contact_identify', c.identify,
            'contact_channel', c.channel
          )
        ) AS reminders
      FROM
        "users_to_reminders" AS utr
      INNER JOIN
        contacts AS c ON utr."contactId" = c.id
      INNER JOIN
        reminders AS r ON utr."reminderId" = r.id
      WHERE
        EXTRACT(EPOCH FROM r.scheduled) BETWEEN ${nowFormatted} AND ${minutesLaterFormatted}
        AND utr.status = 'PENDING'
        AND r."isActivated" = true
      GROUP BY
        r.scheduled, c.channel
      ORDER BY
        r.scheduled, c.channel;
    `;

    // Salva os lembretes agrupados pela data/horário e o canal no cache
    scheduledReminders.forEach(async (item) => {
      const date = new Date(item.scheduled);
      const key = `${date.toISOString()}_${item.channel}`;

      await this.cacheService.set(
        key,
        JSON.stringify(item.reminders),
        1 * 60 * 60 * 1000,
      ); // TTL de 1 hora
    });

    return {
      startDate: nowWithoutOffset.toISOString(),
      endDate: minutesLaterWithoutOffset.toISOString(),
      reminders: scheduledReminders,
    };
  }

  public async create(reminderDto: CreateReminderDto) {
    const userToReminderConnect = reminderDto.usersToReminder.map(
      (contactId) => ({
        contactId,
      }),
    );

    // Verifica se a data de agendamento do lembrete é maior/igual que 30min do horário atual
    const validScheduledDate = isValidScheduledDate(
      reminderDto.scheduled,
      this.scheduledReminderTimeLimit,
    );

    if (!validScheduledDate) {
      throw new BadRequestException(
        'A data do agendamento deve ter 30min a frente da data atual.',
      );
    }

    const newReminder = await this.prismaService.reminder.create({
      data: {
        title: reminderDto.title,
        description: reminderDto.description,
        scheduled: reminderDto.scheduled,
        ownerId: reminderDto.ownerId,
        usersToReminder: {
          create: userToReminderConnect,
        },
      },
    });

    return newReminder;
  }

  /**
   * Updates a reminder with the data.
   *
   * @param {string} id - The ID of the reminder to be updated.
   * @param {UpdateReminderDto} reminderDto - The DTO containing the update data.
   * @returns {Promise<Reminder>} - A promise that resolves when the update is complete.
   */
  public async update(id: string, reminderDto: UpdateReminderDto) {
    if (Object.keys(reminderDto).length === 0) {
      throw new BadRequestException('Nenhum campo foi atualizado');
    }

    // Verifica se a data de agendadamento do lembrete é maior/igual que 30min do horário atual
    const validScheduledDate = isValidScheduledDate(
      reminderDto.scheduled,
      this.scheduledReminderTimeLimit,
    );

    if (!validScheduledDate) {
      throw new BadRequestException(
        'A data do agendamento deve ter 30min a frente da data atual.',
      );
    }

    const reminder = await this.prismaService.reminder.findUnique({
      where: {
        id,
      },
    });

    if (!reminder) {
      throw new NotFoundException('Não foi possível encontrar o lembrete');
    }

    if (reminder.scheduled.getTime() < new Date().getTime()) {
      throw new ForbiddenException(
        'Não é permitido atualizar um lembrete com a data inferior a data corrente',
      );
    }

    const reminderUpdated = await this.prismaService.reminder.update({
      where: { id },
      data: {
        title: reminderDto.title,
        description: reminderDto.description,
        scheduled: reminderDto.scheduled,
        ownerId: reminderDto.ownerId,
        usersToReminder: {
          deleteMany: {},
          create: reminderDto.usersToReminder?.map((id) => ({
            contact: { connect: { id } },
          })),
        },
      },
    });

    return reminderUpdated;
  }

  public async remove(reminderId: string, userId: string) {
    const reminder = await this.prismaService.reminder.findUnique({
      where: { id: reminderId, ownerId: userId },
      select: { id: true, ownerId: true },
    });

    if (!reminder) {
      throw new NotFoundException('Não foi possível encontrar o lembrete');
    }

    if (reminder.ownerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover este lembrete',
      );
    }

    await this.prismaService.reminder.delete({
      where: { id: reminderId },
      include: {
        usersToReminder: true,
      },
    });

    return true;
  }

  public async removeAll(userId: string) {
    const reminders = await this.prismaService.reminder.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (reminders.length === 0) {
      throw new NotFoundException('Nenhum lembrete encontrado');
    }

    // dletando a tabela usersToReminder associada com o reminder
    await this.prismaService.usersToReminder.deleteMany({
      where: {
        reminderId: { in: reminders.map((reminder) => reminder.id) },
      },
    });

    // deletando o reminder
    await this.prismaService.reminder.deleteMany({
      where: { ownerId: userId },
    });

    return true;
  }
}
