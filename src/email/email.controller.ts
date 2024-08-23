import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { QueueList } from '../queue/utils/queue-list';
import { EmailQueueService } from '../queue/email-queue/email-queue.service';
import { EmailsToSendDto } from './dto/email.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('email')
@ApiExcludeController(true)
export class EmailController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly emailQueueService: EmailQueueService,
    private readonly prismaService: PrismaService,
    //@Inject('EMAIL_LISTENER_SERVICE')
    //private readonly emailListenerService: ClientProxy,
    //! preica corrigir esse erro de importação e fazer funcionar os events para não sobrecarregar o servidor nas criações de emails
  ) {}
  @Post('massive')
  @ApiOperation({ summary: 'Send massive emails' })
  public async sendMassiveEmails(
    @Body() emailDto: EmailsToSendDto,
    @Res() response: Response,
  ): Promise<Response> {
    emailDto.emails.forEach((email) => {
      this.rabbitMQService.enqueueTask(QueueList.EMAIL, {
        email,
        subject: emailDto.subject,
        message: emailDto.message,
      });
    });
    return response.status(HttpStatus.OK).json({ message: 'Emails queued' });
  }

  @Get('test')
  public async sendEmailTest(@Res() response: Response): Promise<Response> {
    const firstUser = await this.prismaService.user.findFirst();
    const newEmail = await this.prismaService.email.create({
      data: {
        from: 'dont-need-popualate',
        to: 'jhone.test14@gmail.com',
        subject: 'subject',
        html: 'html',
        //agendar para daqui a 1 minuto
        scheduled: new Date(new Date().getTime() + 60 * 1000),
        owner: { connect: { id: firstUser.id } },
      },
    });
    /* this.rabbitMQService.sendMessage('message_save_email', {
      message: 'Teste',
    });

    this.rabbitMQService.sendMessage('event_save_email', {
      message: 'Teste',
    }); */

    return response
      .status(HttpStatus.OK)
      .json({ message: 'novo email criado para daqui a 1 minuto', newEmail });
  }
}
