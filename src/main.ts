import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'cats_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  });
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Go lembrar API')
    .setDescription('GO Lembrar é uma aplicação para gerenciar lembretes.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  // Configurando conexão com RabbitMQ
  const port = 3000;
  app.listen(port).then(() => {
    const logger = new Logger(bootstrap.name);
    logger.log('Server listening on ' + port);
  });
}
bootstrap();
