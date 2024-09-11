import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailtrapModule } from './mailtrap/mailtrap.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailtrapModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_SERVICE_PORT, 10),
        auth: {
          user: process.env.EMAIL_AUTH_USER,
          pass: process.env.EMAIL_AUTH_PASSWORD,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
