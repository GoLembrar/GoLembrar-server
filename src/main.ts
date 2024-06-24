import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  });
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Go Lembrar API')
    .setDescription('O APP de lembretes que você recebe no seu WhatsApp')
    .setVersion('0.1')
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
