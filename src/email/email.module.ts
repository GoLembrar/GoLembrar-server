import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, PrismaService],
  exports: [EmailService]
})
export class EmailScheduledModule {}
