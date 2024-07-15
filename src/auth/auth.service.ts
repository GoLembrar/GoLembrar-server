import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { HashUtil } from '../common/utils/hashUtil';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(
    credentials: CredentialsDto,
  ): Promise<{ token: string; refreshToken: string }> {
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
    };

    const token = this.jwt.sign(jwtPayloadData, {
      expiresIn: process.env.JWT_EXP,
    });
    const refreshToken = this.jwt.sign(jwtPayloadData, {
      expiresIn: process.env.JWT_REFRESH_EXP,
    });

    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload: JwtPayload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.users.findUnique({
        where: { id: payload.id, email: payload.email, name: payload.name },
      });

      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      const token = this.jwt.sign(
        { id: user.id },
        { expiresIn: process.env.JWT_EXP },
      );

      return { token };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token expirado, por favor, relogue',
        );
      } else {
        throw new UnauthorizedException('Refresh token inválido');
      }
    }
  }
}
