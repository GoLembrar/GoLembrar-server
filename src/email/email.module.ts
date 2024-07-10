import { Module } from '@nestjs/common';
import { EmailScheduledService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EmailModule } from '../../consumer-queue-email/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [EmailController],
  providers: [EmailScheduledService, PrismaService, CacheService],
  exports: [EmailScheduledService],
})
export class EmailScheduledModule {}
