import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = 3000;
  app.listen(port).then(() => {
    const logger = new Logger(bootstrap.name);
    logger.log('Server listening on ' + port);
  });
}
bootstrap();
