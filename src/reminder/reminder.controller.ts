import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { AddOwnerToBodyGuard } from './guards';
import { ApiTags } from '@nestjs/swagger';

@Controller('reminder')
@ApiTags('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}
  @UseGuards(AuthorizationGuard, AddOwnerToBodyGuard)
  @Post('')
  createReminder(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.createReminder(createReminderDto);
  }
}
