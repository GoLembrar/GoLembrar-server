import { MailtrapService } from './../../src/email/mailtrap/mailtrap.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly mailtrapService: MailtrapService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(
    email: string,
    subject: string,
    context: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get('EMAIL_AUTH_USER'),
        subject: subject,
        html: `<b>${context}</b>`,
      });
      return true;
    } catch (smtpError) {
      console.log('SMTP error:', smtpError);
      try {
        await this.mailtrapService.sendEmail(email, subject, context);
        return true;
      } catch (apiError) {
        console.log('API error:', apiError);
        return false;
      }
    }
  }
}
