import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { QueueList } from '../utils/queue-list';

@Injectable()
export class EmailQueueService implements OnModuleInit {
  constructor(@Inject('EMAIL-SERVICE') private client: ClientRMQ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('emailQueue.service: Canal RabbitMQ logado com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
      // Trate o erro conforme necessário
    }
  }

  emailQueue(email: string) {
    try {
      this.client.emit(QueueList.EMAIL, { email });
      return {
        message: `Email ao destinatario ${email}, adicionado a fila `,
      };
    } catch (error) {
      console.error('emailQueue.service: Erro ao enviar fila de email:', error);
    }
  }
}
