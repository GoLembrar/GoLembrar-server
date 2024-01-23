import { Body, Controller, Post } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post('')
  createReminder(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.createReminder(createReminderDto);
  }
}
