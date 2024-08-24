import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailtrapService {
  private client: MailtrapClient;
  private sender: { name: string; email: string };

  constructor(private configService: ConfigService) {
    const TOKEN = this.configService.get<string>('MAILTRAP_TOKEN');
    const SENDER_EMAIL = this.configService.get<string>(
      'MAILTRAP_SENDER_EMAIL',
    );

    this.client = new MailtrapClient({ token: TOKEN });
    this.sender = {
      name: this.configService.get<string>('MAILTRAP_SENDER_NAME'),
      email: SENDER_EMAIL,
    };
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const result = await this.client.send({
        from: this.sender,
        to: [{ email: to }],
        subject,
        text,
      });
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
