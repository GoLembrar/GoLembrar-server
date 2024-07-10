import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { JwtModule } from '@nestjs/jwt';
import { EmailQueueModule } from '../queue/email-queue/emailQueue.module';

@Module({
  imports: [JwtModule, EmailQueueModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthorizationGuard],
})
export class UserModule {}
