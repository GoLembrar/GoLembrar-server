import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
    constructor(private readonly prismaService: PrismaService) { }

    async getEmailsDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prismaService.emails.findMany({
            where: {
                dueDate: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        })

    }
}
