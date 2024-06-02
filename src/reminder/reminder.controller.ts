import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { AddOwnerToBodyGuard } from './guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { ForbiddenResponse } from '../swagger/decorators/forbidden.decorator';
import { GetReminderResponse } from './swagger/getReminderResponse.swagger';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { Request } from 'express';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';

@Controller('reminder')
@ApiTags('reminder')
@UseGuards(AuthorizationGuard)
@ApiBearerAuth()
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  @OkResponse(GetReminderResponse)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async getReminderById(@Param('id') id: string) {
    const reminder = await this.reminderService.getReminderById(id);
    if (!reminder)
      throw new NotFoundException('Não foi possível encontrar o lembrete');
    return reminder;
  }

  @Get('')
  @ApiOperation({ summary: 'Get all reminders from user' })
  @OkResponse([GetReminderResponse])
  @UnauthorizedResponse()
  @NotFoundResponse()
  async getRemindersByUser(@Req() request: RequestWithUser) {
    const userId: string = request.user.id;
    return this.reminderService.getUserReminders(userId);
  }

  @Post('')
  @UseGuards(AddOwnerToBodyGuard)
  @ApiOperation({ summary: 'Create a new reminder.' })
  @UnauthorizedResponse()
  @CreatedResponse()
  async createReminder(
    @Body() createReminderDto: CreateReminderDto,
  ): Promise<void> {
    return this.reminderService.createReminder(createReminderDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one reminder.' })
  @OkResponse()
  @UnauthorizedResponse()
  @ForbiddenResponse()
  updateReminder(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ): Promise<void> {
    return this.reminderService.updateReminder(id, updateReminderDto);
  }
}
