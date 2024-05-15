import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbitmq-service',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.USER_RABBITMQ}:${process.env.PASSWORD_RABBITMQ}@localhost:5672`,
          ],

          queue: 'GoLembrar',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [RabbitmqController],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}
