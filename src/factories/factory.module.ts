import { Module } from '@nestjs/common';
import { ReminderFactory } from './reminder.factory';
import { UserFactory } from './user.factory';
import { FactoryService } from './facotry.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FactoryService, ReminderFactory, UserFactory, PrismaService],
  exports: [ReminderFactory, UserFactory],
})
export class FactoryModule {}
