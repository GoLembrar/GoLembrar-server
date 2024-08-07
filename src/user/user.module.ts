import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { PrismaService } from '../prisma/prisma.service';
import { EmailQueueModule } from '../queue/email-queue/emailQueue.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [EmailQueueModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AccessTokenGuard, JwtService],
  exports: [UserService],
})
export class UserModule {}
