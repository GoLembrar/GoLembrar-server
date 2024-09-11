import { Module } from '@nestjs/common';
import { CacheService } from '../../../cache/cache.service';
import { RabbitmqModule } from '../../../rabbitmq/rabbitmq.module';
import { EmailConsumerService } from './email-consumer.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailModule } from '../../email.module';

@Module({
  imports: [RabbitmqModule, EmailModule],
  providers: [EmailConsumerService, PrismaService, CacheService],
  exports: [EmailConsumerService],
})
export class EmailConsumerModule {}
