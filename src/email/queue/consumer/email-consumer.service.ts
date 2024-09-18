import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '../../../rabbitmq/rabbitmq.service';
import { ReminderResponse } from '../../../reminder/dto/scheduled-reminders.response.dto';
import { EmailService } from '../../email.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class EmailConsumerService {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private logger = new Logger(EmailConsumerService.name);

  public async getEmailScheduledRemindersOnQueue() {
    const queue = 'email_queue';

    const reminders =
      await this.rabbitMQService.consumeQueue<ReminderResponse>(queue);

    for (const reminder of reminders) {
      const isSuccess = await this.emailService.sendEmail(
        reminder.contact_identify,
        reminder.reminder_title,
        reminder.reminder_description,
      );

      if (isSuccess) {
        await this.prismaService.usersToReminder.update({
          where: {
            id: reminder.id,
          },
          data: {
            status: Status.SENT,
          },
        });

        this.logger.log(`Email sent to ${reminder.contact_identify}`);
      } else {
        await this.prismaService.usersToReminder.update({
          where: {
            id: reminder.id,
          },
          data: {
            status: Status.FAILED,
          },
        });

        this.logger.log(`Email failed: ${reminder.contact_identify}`);
      }
    }
  }
}
