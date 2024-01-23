import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class ReminderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReminder(reminderDto: CreateReminderDto) {
    return await this.prismaService.reminders.create({
      data: reminderDto,
    });
  }
}
