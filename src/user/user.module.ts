import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AccessTokenGuard, JwtService],
  exports: [UserService],
})
export class UserModule {}
