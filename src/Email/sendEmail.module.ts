import { config } from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendEmailController } from './sendEmail.controller';
import { SendEmailService } from './sendEmail.service';
config();
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.ACCESS_TOKEN,
        },
      },
    }),
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class sendEmailModule {}
