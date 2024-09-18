/* import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
// import { EmailQueueService } from '../queue/email-queue/email-queue.service';
import { EmailsToSendDto } from './dto/email.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { RequestWithUser } from '../common/utils/types/RequestWithUser';

@Controller('email')
@ApiExcludeController(true)
@UseGuards(AccessTokenGuard)
export class EmailController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    // private readonly emailQueueService: EmailQueueService,
    private readonly prismaService: PrismaService,
    //@Inject('EMAIL_LISTENER_SERVICE')
    //private readonly emailListenerService: ClientProxy,
    //! preica corrigir esse erro de importação e fazer funcionar os events para não sobrecarregar o servidor nas criações de emails
  ) {}
  @Post('massive')
  @ApiOperation({ summary: 'Send massive emails' })
  public async sendMassiveEmails(
    @Body() emailDto: EmailsToSendDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    //! esta não é uma melhor forma de fazer isso, mas funciona
    //! novamente, os events ou meessages pattenr precisam ser implementados
    await Promise.all(
      emailDto.emails.map(async (email) => {
        await this.prismaService.email.create({
          data: {
            to: email,
            subject: emailDto.subject,
            html: emailDto.message,
            scheduled: new Date(),
            status: Status.PENDING,
            from: process.env.EMAIL_HOST,
            owner: {
              connect: {
                id: request.user.sub,
              },
            },
          },
        });
      }),
    );
    return response.status(HttpStatus.OK).json({ message: 'Emails queued' });
  }
}
 */
