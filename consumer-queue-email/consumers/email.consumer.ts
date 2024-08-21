import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { QueueList } from '../../src/queue/utils/queue-list';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailConsumer {
  private channel: amqp.Channel;

  constructor(private readonly emailService: EmailService) {
    this.receiveEmail();
  }

  private async receiveEmail() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
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
          data.data.subject,
          data.data.message,
        );
        // Acknowledge the message
        this.channel.ack(msg);
      }
    });
  }
}
