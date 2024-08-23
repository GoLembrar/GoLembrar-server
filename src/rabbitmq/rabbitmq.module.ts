import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { QueueList } from '../queue/utils/queue-list';
import { RabbitMQService } from './rabbitmq.service';
import { QueueServicesList } from '../queue/utils/queue-services-list';
import { EmailQueueModule } from '../queue/email-queue/email-queue.module';
import { EmailListenerModule } from '../events/email-listener/email-listener.module';

@Module({
  providers: [
    RabbitMQService,
    {
      provide: QueueServicesList.RABBITMQ_SERVICE,
      useFactory: () => {
        console.log('CONFIGURANDO RABBITMQ');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: QueueList.DEFAULT,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
  imports: [EmailQueueModule, EmailListenerModule],
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
