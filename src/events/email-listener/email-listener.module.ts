import { Module } from '@nestjs/common';
import { EmailListenerController } from './email-listener.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EmailListenerController],
  imports: [
    ClientsModule.register([
      { name: 'EMAIL_LISTENER_SERVICE', transport: Transport.RMQ },
    ]),
  ],
  providers: [PrismaService],
})
export class EmailListenerModule {}
