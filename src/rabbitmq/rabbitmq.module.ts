import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { QueueList } from '../queue/utils/queue-list';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [
    RabbitMQService,
    {
      provide: 'RABBITMQ-SERVICE',
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
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
