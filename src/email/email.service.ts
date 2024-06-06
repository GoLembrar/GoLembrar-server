import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class EmailService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prismaService: PrismaService
    ) { }

    async getEmailsDueToday() {
        const cachedEmails = await this.cacheManager.get('today_emails');

        if (cachedEmails) {
            return cachedEmails;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

        const todayEmails = this.prismaService.emails.findMany({
            where: {
                dueDate: {
                    gte: today,
                    lt: new Date(today.getTime() + oneDayInMilliseconds)
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        })

        await this.cacheManager.set('today_emails', todayEmails, oneDayInMilliseconds);

        return todayEmails;
    }
}
