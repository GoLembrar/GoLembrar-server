import { Module } from '@nestjs/common';
import { EmailProducerService } from './email-producer.service';
import { CacheService } from '../../../cache/cache.service';
import { RabbitmqModule } from '../../../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  providers: [EmailProducerService, CacheService],
  exports: [EmailProducerService],
})
export class EmailProducerModule {}
