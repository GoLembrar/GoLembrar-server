import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendEmailController } from './sendEmail.controller';
import { SendEmailService } from './sendEmail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'victor.sena186@gmail.com',
          pass: 'jfns zrob bxmm fmsq',
        },
      },
    }),
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class sendEmailModule {}
