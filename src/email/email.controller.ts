import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { EmailScheduledService } from './email.service';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { Response } from 'express';
import { EmailDto } from './dto/email.dto';
import { EmailQueueService } from '../queue/email-queue/emailQueue.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailScheduledService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  @Post('massive')
  public async sendMassiveEmails(
    @Req() request: RequestWithUser,
    @Body() emailDto: EmailDto,
    @Res() response: Response,
  ) {
    emailDto.emails.forEach((email) => {
      this.emailQueueService.emailQueue(email);
    });
    return response.status(200).json({ message: 'Emails queued' });
  }
}
