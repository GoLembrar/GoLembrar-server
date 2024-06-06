import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, PrismaService, CacheService],
  exports: [EmailService]
})
export class EmailScheduledModule {}
