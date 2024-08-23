import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class EmailListenerController {
  @EventPattern('event_save_email')
  public async handleEmailSaveEvent(data: Record<string, any>) {
    console.log('evento chegou aqui de forma assincrona', data);
  }

  @MessagePattern('message_save_email')
  public async getNotifications(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('message_save_email', data);
    console.log(`Pattern: ${context.getMessage()}`);
  }
}
