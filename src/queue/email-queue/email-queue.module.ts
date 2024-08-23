import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueList } from '../utils/queue-list';
import { EmailQueueService } from './email-queue.service';
import { QueueServicesList } from '../utils/queue-services-list';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: QueueServicesList.EMAIL_SERVICE,
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
