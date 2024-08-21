import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailScheduledService } from '../email/email.service';

@Injectable()
export class TasksService {
  constructor(private readonly emailScheduledService: EmailScheduledService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 * * *')
  async getTodayEMails() {
    const todayMails = await this.emailScheduledService.getEmailsDueToday();
    this.logger.debug(
      'getTodayEMails: Called when the current hour is 00:00. All the emails due today are: ',
      JSON.stringify(todayMails),
    );
  }

  @Cron('* * * * *')
  async verifyIfTheresIsEmailToSend() {
    await this.emailScheduledService.sendTodayEmails();
    this.logger.debug('verifyIfTheresIsEmailToSend: Called every minute');
  }

  @Cron('0 8,13,18 * * *')
  async updateCache() {
    await this.emailScheduledService.updateCache();
    this.logger.debug('updateCache: Called every minute');
  }
}
