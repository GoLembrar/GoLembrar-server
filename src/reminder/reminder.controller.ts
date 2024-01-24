import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { AddOwnerToBodyGuard } from './guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { createReminderResponse } from './swagger/createReminderResponse.swagger';
import { Unauthorized } from '../swagger/decorators/unauthorized.decorators';

@Controller('reminder')
@ApiTags('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @UseGuards(AuthorizationGuard, AddOwnerToBodyGuard)
  @Post('')
  @ApiOperation({ summary: 'Create a new reminder.' })
  @OkResponse(createReminderResponse)
  @Unauthorized()
  createReminder(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.createReminder(createReminderDto);
  }
}
