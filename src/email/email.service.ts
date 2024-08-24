import { Injectable, Logger } from '@nestjs/common';
import { Email, Status } from '@prisma/client';
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

  async getEmailsDueToday(): Promise<{ from: string; emails: Email[] }> {
    const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

    if (cachedEmails) {
      return { from: 'cache', emails: cachedEmails };
    }

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    const todayEmails =
      await this.getEmailsDueTodayFromDatabase(oneDayInMilliseconds);

    await this.cacheManager.set(
      'today_emails',
      todayEmails,
      oneDayInMilliseconds,
    );

    return { from: 'database', emails: todayEmails };
  }

  private async getEmailsDueTodayFromDatabase(limitDateInMilliseconds: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prismaService.email.findMany({
      where: {
        scheduled: {
          gt: today, //desnecessario talvez
          lt: new Date(today.getTime() + limitDateInMilliseconds),
        },
        status: Status.PENDING,
      },

      orderBy: {
        scheduled: 'asc',
      },
    });
  }

  //! EXECUTADA A CADA 1 MINUTO
  async sendTodayEmails() {
    const hasEmailsToSend = await this.isThereEmailToSend();
    this.logger.debug(
      `sendTodayEmails: has emails to send: ${hasEmailsToSend}`,
    );
    //* metodo atual so esta pegando oos emails do banco de dados, precisa pegar tambem os que estao na fila chamado 'Email'
    if (true) {
      const { from, emails } = await this.getEmailsDueToday();
      console.log('today emails: ', emails.length, '. from ', from);
      const today = new Date();

      for (const email of emails) {
        try {
          if (email.status === Status.PENDING && email.scheduled <= today) {
            console.info(`Email scheduled to be sent: ${email.to}`);
            await this.emailService.sendEmail(
              email.to,
              email.subject,
              email.html,
            );
            await this.updateEmailStatus(email.id, Status.SENT);
            this.logger.log(`Email sent to ${email.to}`);
          }
        } catch (error) {
          this.logger.error('Error sending email', error);
          await this.updateEmailStatus(email.id, Status.FAILED);
        }
      }
    }
  }

  private async isThereEmailToSend(): Promise<boolean> {
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
    return false;
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
