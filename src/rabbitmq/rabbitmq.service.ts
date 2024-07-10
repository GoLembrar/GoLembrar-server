import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export enum ServicesAvailable {
  RABBITMQ_SERVICE = 'RABBITMQ-SERVICE',
}

@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ-SERVICE')
    private readonly client: ClientProxy,
  ) {}

  public async onModuleInit() {
    try {
      await this.client.connect();
      console.log(
        'RabbitMQService: Conexão & Canal criado e logado com sucesso',
      );
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  public sendMessage(pattern: string, data: any) {
    /* Este método irá enviar uma mensagem para a fila especificada pelo padrão. Utilize esse metodo caso queira executar de forma assincrona ou se quiser tambem de forma sincrona e esperar pelo resultado, devera configurar um callback no metodo subscribe. */
    this.client.send(pattern, data).subscribe();
  }

  public enqueueTask(pattern: string, data: any) {
    /* Este método irá enfileirar uma tarefa na fila especificada pelo padrão e será consumida por algum consumidor que estiver na mesma. É recomendável usar este método quando você não precisa da resposta, pois será executada de forma assíncrona. devera configurar um worker/consumer */
    this.client.emit(pattern, data);
  }
}
