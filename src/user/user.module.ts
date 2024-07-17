import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { EmailQueueModule } from '../queue/email-queue/emailQueue.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthorizationGuard],
  exports: [UserService],
})
export class UserModule {}
