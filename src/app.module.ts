import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReminderModule } from './reminder/reminder.module';
import { CategoryModule } from './category/category.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { sendEmailModule } from './Email/sendEmail.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ReminderModule,
    CategoryModule,
    RabbitmqModule,
    sendEmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
//test
export class AppModule {}

//EHURMCVGHRJ6NNSNQ4LK3N1L;
