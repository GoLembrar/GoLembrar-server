import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../cache/cache.service';
import { Channel } from '@prisma/client';
import { ReminderResponse } from '../../../reminder/dto/scheduled-reminders.response.dto';
import { RabbitMQService } from '../../../rabbitmq/rabbitmq.service';

@Injectable()
export class EmailProducerService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  public async getScheduledEmailReminders(currentTimeKey: string) {
    const queue = 'email_queue';
    const cacheKey = currentTimeKey + '_' + Channel.EMAIL;

    const result = await this.cacheService.getAll();
    const keys = result.filter((key) => key.startsWith(cacheKey));

    let processedCount = 0;

    if (keys.length > 0) {
      for (const key of keys) {
        const value: ReminderResponse[] = await this.cacheService.get(key);

        await this.rabbitmqService.sendToQueue(
          queue,
          Buffer.from(JSON.stringify(value)),
        );

        processedCount++;
      }
    }

    return processedCount;
  }
}
