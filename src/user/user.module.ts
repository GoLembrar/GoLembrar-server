import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { PrismaService } from '../prisma/prisma.service';
import { EmailQueueModule } from '../queue/email-queue/emailQueue.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [EmailQueueModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthorizationGuard, JwtService],
  exports: [UserService],
})
export class UserModule {}
