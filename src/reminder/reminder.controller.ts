import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { AddOwnerToBodyGuard } from './guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Unauthorized } from '../swagger/decorators/unauthorized.decorators';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { Forbidden } from '../swagger/decorators/forbidden.decorator';

@Controller('reminder')
@ApiTags('reminder')
@UseGuards(AuthorizationGuard, AddOwnerToBodyGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new reminder.' })
  @CreatedResponse()
  @Unauthorized()
  createReminder(@Body() createReminderDto: CreateReminderDto): Promise<void> {
    return this.reminderService.createReminder(createReminderDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one reminder.' })
  @OkResponse()
  @Unauthorized()
  @Forbidden()
  updateReminder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReminderDto: UpdateReminderDto,
  ): Promise<void> {
    return this.reminderService.updateReminder(id, updateReminderDto);
  }
}
