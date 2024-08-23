import { Module } from '@nestjs/common';
import { EmailScheduledService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EmailModule } from '../../consumer-queue-email/email/email.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { EmailQueueModule } from '../queue/email-queue/email-queue.module';
import { EmailListenerModule } from '../events/email-listener/email-listener.module';

@Module({
  imports: [EmailModule, RabbitmqModule, EmailQueueModule, EmailListenerModule],
  controllers: [EmailController],
  providers: [EmailScheduledService, PrismaService, CacheService],
  exports: [EmailScheduledService],
})
export class EmailScheduledModule {}
