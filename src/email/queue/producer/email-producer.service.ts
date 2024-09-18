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

  /**
   * Retrieves scheduled email reminders from the cache and sends them to the RabbitMQ queue.
   *
   * @param currentTimeKey - The current time key used to filter cache entries.
   * @returns The number of processed reminders.
   */
  public async getScheduledEmailReminders(
    currentTimeKey: string,
  ): Promise<number> {
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
