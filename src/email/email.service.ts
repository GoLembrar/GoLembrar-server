import { Injectable, Logger } from '@nestjs/common';
import { Status } from '@prisma/client';
import { EmailService } from '../../consumer-queue-email/email/email.service';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailScheduledService {
  constructor(
    private readonly cacheManager: CacheService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private logger = new Logger(EmailScheduledService.name);

  async getEmailsDueToday() {
    const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

    if (cachedEmails) {
      return cachedEmails;
    }

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    const todayEmails =
      await this.getEmailsDueTodayFromDatabase(oneDayInMilliseconds);

    await this.cacheManager.set(
      'today_emails',
      todayEmails,
      oneDayInMilliseconds,
    );

    return todayEmails;
  }

  private async getEmailsDueTodayFromDatabase(limitDateInMilliseconds: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prismaService.email.findMany({
      where: {
        scheduled: {
          gte: today,
          lt: new Date(today.getTime() + limitDateInMilliseconds),
        },
      },
      orderBy: {
        scheduled: 'asc',
      },
    });
  }

  async sendTodayEmails() {
    if (await this.isThereEmailToSend()) {
      const todayEmails = await this.getEmailsDueToday();
      const today = new Date();

      for (const email of todayEmails) {
        try {
          if (email.status === Status.PENDING && email.scheduled <= today) {
            await this.emailService.sendEmail(
              email.to,
              email.subject,
              email.html,
            );
            await this.updateEmailStatus(email.id, Status.SENT);
            this.logger.log(`Email sent to ${email.to}`);
          }
        } catch (e) {
          this.logger.error('Error sending email', e);
          await this.updateEmailStatus(email.id, Status.FAILED);
        }
      }
    }
  }

  private async isThereEmailToSend() {
    const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

    if (cachedEmails) {
      return (
        cachedEmails.length > 0 &&
        cachedEmails.some(
          (email) =>
            email.status === Status.PENDING || email.status === Status.FAILED,
        )
      );
    }
  }

  async updateEmailStatus(emailId: number, status: Status) {
    await this.prismaService.email.update({
      where: {
        id: emailId,
      },
      data: {
        status,
      },
    });
  }

  async updateCache() {
    await this.cacheManager.del('today_emails');

    await this.getEmailsDueToday();

    this.logger.log('Email cache updated at: ' + new Date().toISOString());
  }
}
export { EmailService };
