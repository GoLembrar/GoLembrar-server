import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly cacheManager: CacheService,
        private readonly prismaService: PrismaService
    ) { }

    async getEmailsDueToday() {
        const cachedEmails = await this.cacheManager.get<any[]>('today_emails');

        if (cachedEmails) {
            return cachedEmails;
        }

        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

        const todayEmails = await this.getEmailsDueTodayFromDatabase(oneDayInMilliseconds);

        await this.cacheManager.set('today_emails', todayEmails, oneDayInMilliseconds);

        return todayEmails;
    }

    private async getEmailsDueTodayFromDatabase(limitDateInMilliseconds: number) {
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
}
