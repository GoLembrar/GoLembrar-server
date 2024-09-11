import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from '../../../cache/cache.service';
import { Channel } from '@prisma/client';
import { ReminderResponse } from '../../../reminder/dto/scheduled-reminders.response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RabbitMQService } from '../../../rabbitmq/rabbitmq.service';

@Injectable()
export class EmailProducerService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: CacheService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  public async getScheduledEmailReminders(currentTimeKey: string) {
    const cacheKey = currentTimeKey + '_' + Channel.EMAIL;
    const queue = 'email_queue';

    const result: string = await this.cacheService.get(cacheKey);
    const values: ReminderResponse[] = result && JSON.parse(result);

    if (values !== undefined && values.length > 0) {
      for (const value of values) {
        this.rabbitmqService.sendToQueue(
          queue,
          Buffer.from(JSON.stringify(value)),
        );
      }

      return values.length;
    } else {
      return 0;
    }
  }
}
