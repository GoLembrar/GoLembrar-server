import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(): Promise<void> {
    await this.mailerService.sendMail({
      to: 'victor.sena186@gmail.com',
      from: 'victor.sena186@gmail.com',
      subject: 'Testing Nest MailerModule',
      text: 'Bem Vindo',
      html: '<b>Bem vindo ao GoLembrar</b>',
    });
    console.log('mensagem enviada com sucesso');
  }
}
