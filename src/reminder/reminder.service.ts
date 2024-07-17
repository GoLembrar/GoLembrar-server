import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class ReminderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getReminderById(id: string) {
    return await this.prismaService.reminder.findFirst({
      where: { id: id },
    });
  }

  async getUserReminders(userId: string) {
    return await this.prismaService.reminder.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async createReminder(reminderDto: CreateReminderDto) {
    await this.prismaService.reminder.create({
      data: reminderDto,
    });
  }

  async updateReminder(
    id: string,
    reminderDto: UpdateReminderDto,
  ): Promise<void> {
    if (Object.keys(reminderDto).length === 0)
      throw new ForbiddenException('Não existem dados para serem atualizados');

    const currentTime = Date.now();
    const minimumScheduleTime = currentTime + 15 * 60 * 1000; // 15 minutes in milliseconds

    const validScheduledDate =
      reminderDto.scheduled &&
      new Date(reminderDto.scheduled).getTime() > minimumScheduleTime;

    if (!reminderDto.scheduled || validScheduledDate) {
      await this.prismaService.reminder.update({
        where: { id },
        data: reminderDto,
      });
      return;
    }

    throw new ForbiddenException(
      'Não é permitido agendar um lembrete com data menor que 15 minutos no futuro',
    );
  }
}
