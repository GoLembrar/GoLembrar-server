import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { ForbiddenResponse } from '../swagger/decorators/forbidden.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { AddOwnerToBodyGuard } from './guards';
import { ReminderService } from './reminder.service';
import { GetReminderResponse } from './swagger/getReminderResponse.swagger';
import { NotFoundResponse } from '../swagger/decorators/not-found.decorator';
import { NoContentResponse } from '../swagger/decorators/no-content.decorator';

@Controller('reminder')
@ApiTags('reminder')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('JWT-Token')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  @OkResponse('Reminder found response successfully', GetReminderResponse)
  @UnauthorizedResponse()
  @NotFoundResponse()
  async getReminderById(@Param('id') id: string) {
    return await this.reminderService.getReminderById(id);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all reminders from user' })
  @OkResponse('Reminders found response successfully', [GetReminderResponse])
  @UnauthorizedResponse()
  async getRemindersByUser(@Req() request: RequestWithUser) {
    const userId: string = request.user['sub'];
    return this.reminderService.getUserReminders(userId);
  }

  @Post('')
  @UseGuards(AddOwnerToBodyGuard)
  @ApiOperation({ summary: 'Create a new reminder.' })
  @CreatedResponse('Reminder created response successfully', 'reminder created')
  @UnauthorizedResponse()
  async createReminder(
    @Req() request: RequestWithUser,
    @Body() createReminderDto: CreateReminderDto,
    @Res() response: Response,
  ): Promise<Response> {
    createReminderDto.ownerId = request.user['sub'];
    const reminder =
      await this.reminderService.createReminder(createReminderDto);
    return response.status(HttpStatus.CREATED).json({
      message: 'reminder created',
      reminder,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one reminder.' })
  @NoContentResponse('Reminder updated response successfully')
  @UnauthorizedResponse()
  @ForbiddenResponse()
  async updateReminder(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @Res() response: Response,
  ): Promise<Response> {
    const reminderUpdated = await this.reminderService.updateReminder(
      id,
      updateReminderDto,
    );
    return response.status(HttpStatus.OK).json({
      message: 'reminder updated',
      reminderUpdated,
    });
  }

  @Delete('/all/')
  @ApiOperation({ summary: 'Delete all reminders from user' })
  @OkResponse('Reminders removed response successfully')
  @UnauthorizedResponse()
  @ForbiddenResponse()
  async removeAllReminders(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userId: string = request.user['sub'];
    const remindersDeleted = await this.reminderService.removeAll(userId);
    return response.status(HttpStatus.OK).json({
      message: 'reminders removed',
      remindersDeleted,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder.' })
  @OkResponse('Reminder removed response successfully')
  @UnauthorizedResponse()
  @ForbiddenResponse()
  async removeReminder(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<Response> {
    const userId: string = request.user['sub'];
    const reminderRemoved = await this.reminderService.remove(id, userId);
    return response.status(HttpStatus.OK).json({
      message: 'reminder removed',
      reminderRemoved,
    });
  }
}
