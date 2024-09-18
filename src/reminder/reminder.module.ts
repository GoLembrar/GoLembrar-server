import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService, PrismaService, JwtService, CacheService],
  exports: [ReminderService],
})
export class ReminderModule {}
