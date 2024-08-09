import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { PrismaService } from './prisma/prisma.service';
import { ReminderModule } from './reminder/reminder.module';
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
    // EmailModule,
    // RabbitmqModule,
    // TasksModule,
    // EmailScheduledModule,
    ScheduleModule.forRoot(),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    //  CacheService
  ],
})
export class AppModule {}
