import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { QueueList } from '../utils/queue-list';
import { EmailQueueService } from './emailQueue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QueueList.EMAIL,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [EmailQueueService],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
