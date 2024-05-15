import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReminderModule } from './reminder/reminder.module';
import { CategoryModule } from './category/category.module';
<<<<<<< HEAD
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
=======
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
>>>>>>> 3c2860b99c16bea193f34610e137d2d70ca71947

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/docs'
    }),
    UserModule,
    AuthModule,
    ReminderModule,
    CategoryModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
//test
export class AppModule {}
