import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EmailService } from '../../consumer-queue-email/email/email.service';
import { EmailPrisma } from './dto/EmailPrisma';
import { EmailStatus } from '@prisma/client';

@Injectable()
export class EmailScheduledService {
    constructor(
        private readonly cacheManager: CacheService,
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService
    ) { }

    private logger = new Logger(EmailScheduledService.name);

    async getEmailsDueToday(): Promise<EmailPrisma[]> {
        const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

        if (cachedEmails) {
            return cachedEmails;
        }

        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

        const todayEmails = await this.getEmailsDueTodayFromDatabase(oneDayInMilliseconds);

        await this.cacheManager.set('today_emails', todayEmails, oneDayInMilliseconds);

        return todayEmails;
    }

    private async getEmailsDueTodayFromDatabase(limitDateInMilliseconds: number): Promise<EmailPrisma[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prismaService.emails.findMany({
            where: {
                dueDate: {
                    gte: today,
                    lt: new Date(today.getTime() + limitDateInMilliseconds)
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        })
    }


    async sendTodayEmails() {
        if (await this.isThereEmailToSend()) {
            const todayEmails = await this.getEmailsDueToday();

            for (const email of todayEmails) {
                try {
                    if (email.status === EmailStatus.PENDING) {
                        await this.emailService.sendEmail(email.to, email.subject, email.html);
                        await this.updateEmailStatus(email.id, EmailStatus.SENT);
                        this.logger.log(`Email sent to ${email.to}`);
                    }
                } catch (e) {
                    this.logger.error('Error sending email', e);
                    await this.updateEmailStatus(email.id, EmailStatus.FAILED);
                }
            }
        }
    }


    private async isThereEmailToSend() {
        const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

        if (cachedEmails) {
            return cachedEmails.length > 0 && cachedEmails.some(email => email.status === EmailStatus.PENDING || email.status === EmailStatus.FAILED);
        }
    }

    async updateEmailStatus(emailId: number, status: EmailStatus) {
        await this.prismaService.emails.update({
            where: {
                id: emailId
            },
            data: {
                status
            }
        });
    }
}
