import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthorizationGuard],
})
export class UserModule {}
