/* import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { QueueServicesList } from '../utils/queue-services-list';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class EmailQueueService implements OnModuleInit {
  constructor(
    @Inject(QueueServicesList.EMAIL_SERVICE) private readonly client: ClientRMQ,
  ) {}
  async onModuleInit() {
    try {
      await this.client.connect();
      console.log(
        'EmailQueueService: conexão com o rabbitmq feita com sucesso!',
      );
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  public enqueueTask(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }

  //? maybe call the camae email-event on pattenr
  public sendMessage(pattern: string, data: any) {
    return this.client.send(pattern, data).subscribe();
  }
}
 */
