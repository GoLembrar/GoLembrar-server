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
            urls: [
              `amqp://${process.env.USER_RABBITMQ}:${process.env.PASSWORD_RABBITMQ}@rabbitmq:5672`,
            ],
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
