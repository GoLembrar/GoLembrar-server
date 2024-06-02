import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashUtil } from '../common/utils/hashUtil';
import { Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
    };

    const token = this.jwt.sign(jwtPayloadData);
    return { token };
  }
}
