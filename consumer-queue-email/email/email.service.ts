import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(
    email: string,
    subject: string,
    context: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get('EMAIL_AUTH_USER'),
      subject: subject,
      html: `<b>${context}</b>`,
    });
  }
}
