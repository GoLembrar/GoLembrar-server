import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashUtil } from '../common/utils/hashUtil';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async login(credentials: CredentialsDto) {
    const foundUser = await this.prismaService.user.findFirst({
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

    const token = this.jwtService.sign(jwtPayloadData, {
      expiresIn: process.env.JWT_EXP,
    });
    const refreshToken = this.jwtService.sign(jwtPayloadData, {
      expiresIn: process.env.JWT_REFRESH_EXP,
    });

    return { token, refreshToken };
  }

  verifyToken(token: string, secret: string): boolean {
    try {
      return Boolean(
        this.jwtService.verify(token, {
          secret,
        }),
      );
    } catch (err) {
      return false;
    }
  }

  async genTokens(id: string) {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: process.env.JWT_EXP,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: process.env.JWT_REFRESH_EXP,
        },
      ),
    ]);

    return { token, refreshToken };
  }

  async refreshTokens(token: string, id: string) {
    if (!token || !id)
      throw new UnauthorizedException('Credenciais não fornecidas');

    const verify = this.verifyToken(token, process.env.JWT_REFRESH_SECRET);

    if (verify) {
      const user = await this.userService.findOne(id);

      if (!user) throw new UnauthorizedException('Credenciais inválidas');

      return await this.genTokens(user.id);
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }
}
