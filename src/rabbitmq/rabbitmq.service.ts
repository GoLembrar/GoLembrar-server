// import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { QueueServicesList } from '../queue/utils/queue-services-list';

// @Injectable()
// export class RabbitMQService implements OnModuleInit {
//   constructor(
//     @Inject(QueueServicesList.RABBITMQ_SERVICE)
//     private readonly client: ClientProxy,
//   ) {}

//   public async onModuleInit() {
//     try {
//       await this.client.connect();
//       console.log(
//         'RabbitMQService: Conexão & Canal criado e logado com sucesso',
//       );
//     } catch (error) {
//       console.error('Erro ao conectar ao RabbitMQ:', error);
//     }
//   }

//   public sendMessage(pattern: string, data: any) {
//     /* Este método irá enviar uma mensagem para a fila especificada pelo padrão. Utilize esse metodo caso queira executar de forma assincrona ou se quiser tambem de forma sincrona e esperar pelo resultado, devera configurar um callback no metodo subscribe. */
//     return this.client.send(pattern, data).subscribe();
//   }

//   public enqueueTask(pattern: string, data: any) {
//     /* Este método irá enfileirar uma tarefa na fila especificada pelo padrão e será consumida por algum consumidor que estiver na mesma. É recomendável usar este método quando você não precisa da resposta, pois será executada de forma assíncrona. devera configurar um worker/consumer */
//     return this.client.emit(pattern, data);
//   }
// }

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {}

  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error(
        `Failed to connect to RabbitMQ: ${this.rabbitmqUrl}`,
        error,
      );
    }
  }

  public getChannel(): amqp.Channel {
    if (!this.channel) {
      console.error('RabbitMQ channel is not established yet');
    }
    return this.channel;
  }

  public async sendToQueue(queue: string, message: Buffer) {
    if (!this.channel) {
      this.logger.error('RabbitMQ channel is not established');
      return;
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, message);
    this.logger.debug(`Message sent to queue: ${queue}`);
  }

  public async consumeQueue<T>(queue: string, timeout = 1000): Promise<T[]> {
    const results: T[] = [];

    if (!this.channel) {
      this.logger.error('RabbitMQ channel is not established');
      return;
    }

    await this.channel.assertQueue(queue, { durable: true });

    return new Promise((resolve) => {
      setTimeout(() => {
        this.channel.cancel('consumer_tag');
        resolve(results);
      }, timeout);

      this.channel.consume(
        queue,
        async (msg) => {
          if (msg !== null) {
            try {
              const parsedMessage: T = JSON.parse(msg.content.toString());
              results.push(parsedMessage);
              this.channel.ack(msg);
            } catch (error) {
              this.logger.error('Error processing message', error);
              this.channel.nack(msg);
            }
          }
        },
        { noAck: false, consumerTag: 'consumer_tag' },
      );
    });
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
