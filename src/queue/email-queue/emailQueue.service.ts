import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class EmailQueueService {
  constructor(@Inject('EMAIL-SERVICE') private client: ClientRMQ) {
    this.initialize();
  }
  async initialize() {
    try {
      await this.client.connect();
      console.log('Canal RabbitMQ logado com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
      // Trate o erro conforme necessário
    }
  }

  async emailQueue(email: string) {
    try {
      this.client.emit('send_email', { email });
      return {
        message: `Email ao destinatario ${email}, adicionado a fila `,
      };
    } catch (error) {
      console.error('Erro ao enviar fila de email:', error);
    }
  }
}
