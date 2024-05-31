import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    RabbitmqService,
    {
      provide: 'rabbitmq-service',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'task_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}