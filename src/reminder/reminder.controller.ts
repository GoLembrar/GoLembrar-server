import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { CreatedResponse } from '../swagger/decorators/created.decorator';
import { ForbiddenResponse } from '../swagger/decorators/forbidden.decorator';
import { NotFoundResponse } from '../swagger/decorators/notFound.decorator';
import { OkResponse } from '../swagger/decorators/ok.decorator';
import { UnauthorizedResponse } from '../swagger/decorators/unauthorized.decorator';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { AddOwnerToBodyGuard } from './guards';
import { ReminderService } from './reminder.service';
import { GetReminderResponse } from './swagger/getReminderResponse.swagger';
import { Response } from 'express';

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
  async updateReminder(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @Res() response: Response,
  ): Promise<Response> {
    await this.reminderService.updateReminder(id, updateReminderDto);
    return response.status(HttpStatus.NO_CONTENT).json({
      message: 'reminder updated',
    });
  }
}
