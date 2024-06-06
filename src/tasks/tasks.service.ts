import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

@Injectable()
export class TasksService {

    constructor(private readonly emailScheduledService: EmailService) {}

    private readonly logger = new Logger(TasksService.name);


    @Cron('0 0 * * *')
    getTodayEMails() {
        this.emailScheduledService.getEmailsDueToday();
        this.logger.debug('Called when the current hour is 00:00');
    }

    @Cron('* * * * *')
    verifyIfTheresIsEmailToSend() {
        this.logger.debug('Called when the current second is 45');
    }

}
