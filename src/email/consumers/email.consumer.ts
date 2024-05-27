import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { connect, Channel } from 'amqplib';
import { EmailService } from '../email.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class EmailConsumer {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: 'send_email' })
  async receiveEmail(email: string) {
    await this.emailService.sendEmail(
      email,
      'Mensagem de boas vindas',
      'Bem vindo ao GoLembrar',
    );
  }
}
