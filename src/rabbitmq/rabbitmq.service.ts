import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private readonly logger = new Logger();
  constructor(@Inject('rabbitmq-service') private client: ClientProxy) { }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Conexão com RabbitMQ estabelecida com sucesso.');
      console.log('Canal RabbitMQ criado com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
      // Trate o erro conforme necessário
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMessage(pattern: string, data: any) {
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

  async enqueueTask(task: any, queue: string = 'task_queue') {
    try {
      await this.client.send(queue, task);
      this.logger.log(`Task enqueued: ${JSON.stringify(task)}`);
    } catch (error) {
      this.logger.error(`Error enqueueing task: ${error}`);
    }
  }
}
