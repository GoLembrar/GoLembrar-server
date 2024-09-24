import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import type { RedisClientOptions } from 'redis';
import { EmailModule } from '../consumer-queue-email/email/email.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cache.service';
import { ContactModule } from './contact/contact.module';
// import { EmailScheduledModule } from './email/email.module';
import { MailtrapModule } from './email/mailtrap/mailtrap.module';
import { FactoryModule } from './factories/factory.module';
import { PrismaService } from './prisma/prisma.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ReminderModule } from './reminder/reminder.module';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/static'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    AuthModule,
    UserModule,
    ReminderModule,
    ContactModule,
    EmailModule,
    RabbitmqModule,
    TasksModule,
    // EmailScheduledModule,
    MailtrapModule,
    FactoryModule,
    ScheduleModule.forRoot(),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      host: process.env.KEYDB_HOST,
      port: parseInt(process.env.KEYDB_PORT, 10) || 6379,
      password: process.env.KEYDB_PASSWORD,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, CacheService],
})
export class AppModule {}
