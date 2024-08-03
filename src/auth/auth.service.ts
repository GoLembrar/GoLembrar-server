import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashUtil } from '../common/utils/hashUtil';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CredentialsDto } from './dto/credentials.dto';

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

    const tokens = await this.genTokens(foundUser.id);

    return tokens;
  }

  /**
   * @param token The JWT token to be verify
   * @param secret The secret used for signature this token
   * @returns Boolean if is valid or invalid token
   */
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

  /**
   * @param email Email of the user
   * @returns The access and refresh token
   */
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
