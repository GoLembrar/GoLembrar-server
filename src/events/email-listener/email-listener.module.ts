import { Module } from '@nestjs/common';
import { EmailListenerController } from './email-listener.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [EmailListenerController],
  imports: [
    ClientsModule.register([
      { name: 'EMAIL_LISTENER_SERVICE', transport: Transport.RMQ },
    ]),
  ],
})
export class EmailListenerModule {}
