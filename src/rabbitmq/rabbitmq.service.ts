import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger();
  constructor(@Inject('rabbitmq-service') private client: ClientProxy) {
    this.initialize();
  }
  async initialize() {
    try {
      await this.client.connect();
      this.logger.log('Conexão com RabbitMQ estabelecida com sucesso.');
      console.log('Canal RabbitMQ criado com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
      // Trate o erro conforme necessário
    }
  }

  async sendMessage() {
    try {
      const menssge = {
        id: `${Math.random() * 100}}`,
        data: {
          name: `RabbitMQ-${Math.random() * 100}}`,
        },
      };
      this.client.emit('send_message', menssge);
      return {
        message: 'Mensagem enviada',
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }
}
