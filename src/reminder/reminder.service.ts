import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class ReminderService {
  constructor(private readonly prismaService: PrismaService) {}

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

  public async createReminder(reminderDto: CreateReminderDto) {
    const userToReminderConnect = reminderDto.usersToReminder.map(
      (contactId) => ({
        contactId,
      }),
    );

    return await this.prismaService.reminder.create({
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
  }

  /**
   * Updates a reminder with the data.
   *
   * @param {string} id - The ID of the reminder to be updated.
   * @param {UpdateReminderDto} reminderDto - The DTO containing the update data.
   * @returns {Promise<Reminder>} - A promise that resolves when the update is complete.
   */
  public async updateReminder(id: string, reminderDto: UpdateReminderDto) {
    if (Object.keys(reminderDto).length === 0) {
      throw new BadRequestException('Nenhum campo foi atualizado');
    }

    const currentTime = Date.now();
    const minimumScheduleTime = currentTime + 30 * 60 * 1000; // 30 minutes in milliseconds

    const validScheduledDate =
      reminderDto.scheduled &&
      new Date(reminderDto.scheduled).getTime() > minimumScheduleTime;

    if (!reminderDto.scheduled || validScheduledDate) {
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

    throw new ForbiddenException(
      'Não é permitido agendar um lembrete com data menor que 30 minutos no futuro',
    );
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
