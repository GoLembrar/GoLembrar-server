import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashUtil } from '../common/utils/hashUtil';
import { Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailQueueService } from '../queue/email-queue/emailQueue.service';
import { EmailService } from '../email/email.service';
import { EmailConsumer } from '../email/consumers/email.consumer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailQueue: EmailQueueService,
    private readonly emailConsumer: EmailConsumer,
  ) {}

  async login(credentials: CredentialsDto): Promise<{ token: string }> {
    const foundUser: Users = await this.prisma.users.findFirst({
      where: {
        email: credentials.email,
      },
    });

    if (!foundUser) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordMatching: boolean = await HashUtil.compare(
      credentials.password,
      foundUser.password,
    );

    if (!isPasswordMatching)
      throw new UnauthorizedException('Credenciais inválidas');
    const jwtPayloadData: JwtPayload = {
      id: foundUser.id,
    };

    await this.emailQueue.emailQueue(foundUser.email);
    await this.emailConsumer.receiveEmail(foundUser.email);
    const token = this.jwt.sign(jwtPayloadData);
    return { token };
  }
}
