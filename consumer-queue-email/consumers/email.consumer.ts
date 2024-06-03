import { ClientRMQ, MessagePattern } from '@nestjs/microservices';
import { EmailService } from '../email/email.service';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { QueueList } from '../../src/queue/utils/queue-list';
@Injectable()
export class EmailConsumer {
  private channel: amqp.Channel;

  constructor(private readonly emailService: EmailService) {
    this.receiveEmail();
  }

  private async receiveEmail() {
    const connection = await amqp.connect(
      `amqp://${process.env.USER_RABBITMQ}:${process.env.PASSWORD_RABBITMQ}@localhost`,
    );
    this.channel = await connection.createChannel();
    console.log('EmailConsumer: conexão feita com sucesso!');
    // Consume messages from the queue
    this.channel.consume(QueueList.EMAIL, async (msg: any) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(data);
        const email = data.data.email;
        console.log(email);
        // Call the email service to send email
        await this.emailService.sendEmail(
          email,
          'Mensagem de boas vindas',
          'Bem vindo ao GoLembrar',
        );
        /* new Promise((resolve, reject) => {
          setTimeout(
            () => {
              resolve(console.log(`EMAIL ENVIADO COM SUCESSO PARA: ${email}`));
            },
            Math.floor(Math.random() * 5000 + 1000),
          );
        }); */

        // Acknowledge the message
        this.channel.ack(msg);
      }
    });
  }
}
