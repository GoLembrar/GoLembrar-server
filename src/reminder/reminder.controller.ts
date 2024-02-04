import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { getReminderResponse } from './swagger/getReminderResponse.swagger';
import { NotFound } from '../swagger/decorators/not-found.decorator';

@Controller('reminder')
@ApiTags('reminder')
@UseGuards(AuthorizationGuard, AddOwnerToBodyGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a reminder by id' })
  @OkResponse(getReminderResponse)
  @Unauthorized()
  @NotFound()
  async getReminderById(@Param('id', ParseIntPipe) id: number) {
    const reminder = await this.reminderService.getReminderById(id);
    if (!reminder)
      throw new NotFoundException('Não foi possível encontrar o lembrete');
    return reminder;
  }

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
