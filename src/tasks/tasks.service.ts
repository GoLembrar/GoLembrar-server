import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReminderService } from '../reminder/reminder.service';
import { EmailProducerService } from '../email/queue/producer/email-producer.service';
// import { ScheduledRemindersResponse } from '../reminder/dto/schedule-reminders.response.dto';
import { EmailConsumerService } from '../email/queue/consumer/email-consumer.service';
//import { EmailScheduledService } from '../email/email.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly reminderService: ReminderService,
    private readonly emailProducerService: EmailProducerService,
    private readonly emailConsumerService: EmailConsumerService,
  ) {}

  private readonly logger = new Logger(TasksService.name);
  private readonly offset = -3 * 60 * 60 * 1000; // -3 horas em milissegundos
  private delayInSendingToQueue = false;
  private delayInGettingToQueue = false;

  // @Cron('0 0 * * *')
  // async getTodayEMails() {
  //   const todayMails = await this.emailScheduledService.getEmailsDueToday();
  //   this.logger.debug(
  //     'getTodayEMails: Called when the current hour is 00:00. All the emails due today are: ',
  //     JSON.stringify(todayMails),
  //   );
  // }

  // @Cron('* * * * *')
  // async verifyIfTheresIsEmailToSend() {
  //   await this.emailScheduledService.sendTodayEmails();
  //   this.logger.debug('verifyIfTheresIsEmailToSend: Called every minute');
  // }

  // @Cron('0 8,13,18 * * *')
  // async updateCache() {
  //   await this.emailScheduledService.updateCache();
  //   this.logger.debug('updateCache: Called every minute');
  // }

  @Cron('0,30 * * * *') // Tarefa executada a cada 30 minutos começando às 00:00
  async getScheduledRemindersEveryThirtyMinutes() {
    const { startDate, endDate, reminders } =
      await this.reminderService.getScheduledRemindersWithinNextThirtyMinutes();

    const scheduledRemindersAmount = reminders.reduce(
      (accumulator, reminder) => {
        const count = Number(reminder.reminders_count);
        return accumulator + count;
      },
      0,
    );

    this.logger.debug(
      `Number of reminders scheduled from ${startDate} to ${endDate}: ${scheduledRemindersAmount}`,
    );
  }

  @Cron('* * * * *') // Tarefa executada a cada minuto com delay de 100ms
  async sendScheduledRemindersToQueueByChannelEveryMinute() {
    const currentTime = Date.now();
    const currentTimeWithoutOffset = new Date(
      currentTime + this.offset,
    ).setSeconds(0, 0);
    const currentTimeFormatted = new Date(
      currentTimeWithoutOffset,
    ).toISOString();

    if (!this.delayInSendingToQueue) {
      this.delayInSendingToQueue = true;
      setTimeout(async () => {
        await this.executeTaskToSendEmailQueue(currentTimeFormatted);
        this.delayInSendingToQueue = false; // Reset the delay execution flag
      }, 100);
    }

    if (!this.delayInGettingToQueue) {
      this.delayInGettingToQueue = true;
      setTimeout(async () => {
        await this.emailConsumerService.getEmailScheduledRemindersOnQueue();
        this.delayInGettingToQueue = false; // Reset the delay execution flag
      }, 200);
    }
  }

  async executeTaskToSendEmailQueue(currentTimeFormatted: string) {
    const tasks =
      await this.emailProducerService.getScheduledEmailReminders(
        currentTimeFormatted,
      );

    this.logger.debug(
      `Called the send to queue routine at: ${currentTimeFormatted} with ${tasks} reminder(s)`,
    );
  }
}
