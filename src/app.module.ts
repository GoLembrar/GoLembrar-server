import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailModule } from '../consumer-queue-email/email/email.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cache.service';
import { CategoryModule } from './category/category.module';
import { ContactModule } from './contact/contact.module';
import { EmailScheduledModule } from './email/email.module';
import { PrismaService } from './prisma/prisma.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ReminderModule } from './reminder/reminder.module';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/docs',
    }),
    UserModule,
    AuthModule,
    ReminderModule,
    CategoryModule,
    ContactModule,
    EmailModule,
    RabbitmqModule,
    ScheduleModule.forRoot(),
    TasksModule,
    EmailScheduledModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, TasksService, CacheService],
})
export class AppModule {}
