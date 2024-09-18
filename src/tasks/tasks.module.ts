import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ReminderService } from '../reminder/reminder.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EmailProducerService } from '../email/queue/producer/email-producer.service';
import { EmailProducerModule } from '../email/queue/producer/email-producer.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { EmailConsumerService } from '../email/queue/consumer/email-consumer.service';
import { EmailConsumerModule } from '../email/queue/consumer/email-consumer.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailProducerModule,
    EmailConsumerModule,
    EmailModule,
    RabbitmqModule,
  ],
  providers: [
    TasksService,
    ReminderService,
    EmailProducerService,
    EmailConsumerService,
    PrismaService,
    CacheService,
  ],
  exports: [TasksService],
})
export class TasksModule {}
