import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class ReminderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReminder(reminderDto: CreateReminderDto): Promise<void> {
    await this.prismaService.reminders.create({
      data: reminderDto,
    });
  }

  async updateReminder(
    id: number,
    reminderDto: UpdateReminderDto,
  ): Promise<void> {
    if (Object.keys(reminderDto).length === 1)
      throw new ForbiddenException('Não existem dados para serem atualizados');
    const validScheduledDate =
      reminderDto.scheduled &&
      new Date(reminderDto.scheduled).getTime() > Date.now() + 15000 * 60;
    if (!reminderDto.scheduled || validScheduledDate) {
      await this.prismaService.reminders.update({
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
