import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

// import { ClientProxyFactory, Transport } from '@nestjs/microservices';
// import { QueueList } from '../queue/utils/queue-list';
// import { QueueServicesList } from '../queue/utils/queue-services-list';
// import { EmailQueueModule } from '../queue/email-queue/email-queue.module';
// import { EmailListenerModule } from '../events/email-listener/email-listener.module';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
