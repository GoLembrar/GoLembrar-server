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
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await connection.createChannel();
        console.log('EmailConsumer: conexão com o rabbitmq feita com sucesso!');

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

        // If successful, break out of the retry loop
        break;
      } catch (error) {
        console.error(
          `Failed to connect to RabbitMQ. Attempt ${retries + 1} of ${maxRetries}`,
        );
        console.error(error);
        retries++;
        // Wait for 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (retries === maxRetries) {
      console.error('Failed to connect to RabbitMQ after maximum retries');
    }
  }
}
