// worker.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { EmailConsumerModule } from './consumers/email.consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailConsumerModule,
    {
      options: {
        port: 3001,
      },
    },
  );

  app.listen();
}

bootstrap();
