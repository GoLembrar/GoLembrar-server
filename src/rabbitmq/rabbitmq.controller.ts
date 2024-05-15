import { Body, Controller, Get } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Controller('/rabbitmq')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get()
  async sendMessage() {
    return await this.rabbitmqService.sendMessage();
  }
}
