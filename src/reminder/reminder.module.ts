import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, PrismaService, JwtService],
})
export class ReminderModule {}
