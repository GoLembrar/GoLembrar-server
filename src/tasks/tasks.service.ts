import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);


    @Cron('0 0 * * *')
    getTodayEMails() {
        this.logger.debug('Called when the current second is 45');
    }

    @Cron('* * * * *')
    verifyIfTheresIsEmailToSend() {
        this.logger.debug('Called when the current second is 45');
    }

}
