import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { EmailScheduledService } from './email.service';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';
import { Response } from 'express';
import { EmailDto } from './dto/email.dto';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { QueueList } from '../queue/utils/queue-list';

@Controller('email')
@ApiExcludeController(true)
export class EmailController {
  constructor(
    private readonly emailService: EmailScheduledService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post('massive')
  @ApiOperation({ summary: 'Send massive emails' })
  public async sendMassiveEmails(
    @Req() request: RequestWithUser,
    @Body() emailDto: EmailDto,
    @Res() response: Response,
  ): Promise<Response> {
    emailDto.emails.forEach((email) => {
      this.rabbitMQService.enqueueTask(QueueList.EMAIL, {
        email,
        subject: emailDto.subject,
        message: emailDto.message,
      });
    });
    return response.status(200).json({ message: 'Emails queued' });
  }
}
