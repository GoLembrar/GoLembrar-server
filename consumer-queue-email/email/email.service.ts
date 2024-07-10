import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    email: string,
    subject: string,
    context: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: subject,
      html: `<b>${context}</b>`,
    });
    console.log('mensagem enviada com sucesso');
  }
}
