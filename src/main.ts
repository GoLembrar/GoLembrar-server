import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { resolve } from 'path';
import { writeFileSync, createWriteStream } from 'fs';
import { get } from 'https';

async function bootstrap() {
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
  const port = 3000;
  app.listen(port).then(() => {
    const logger = new Logger(bootstrap.name);
    logger.log('Server listening on ' + port);
  });

  const serverUrl = 'https://api-golembrar.vercel.app';



  // write swagger ui files
  get(
    `${serverUrl}/swagger/swagger-ui-bundle.js`, function
    (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    console.log(
      `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
    );
  });

  get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    console.log(
      `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
    );
  });

  get(
    `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
    function (response) {
      response.pipe(
        createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
      );
      console.log(
        `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
      );
    });

  get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    console.log(
      `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
    );
  });

}

bootstrap();


