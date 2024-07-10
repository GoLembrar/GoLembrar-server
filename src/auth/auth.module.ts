import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailQueueModule } from '../queue/email-queue/emailQueue.module';
import { EmailModule } from '../../consumer-queue-email/email/email.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXP },
      global: true,
    }),
    EmailQueueModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, PrismaService],
})
export class AuthModule {}
