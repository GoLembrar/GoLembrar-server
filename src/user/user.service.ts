import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { HashUtil } from '../common/utils/hashUtil';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(readonly prismaService: PrismaService) {}

  private readonly logger: Logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email ja cadastrado', HttpStatus.CONFLICT);
    }

    const hashedPassword = await HashUtil.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    await this.prismaService.users.create({
      data: createUserDto,
    });
  }

  async findOne(id: string): Promise<Partial<Users> | null> {
    const foundUser: Users | null = await this.prismaService.users.findFirst({
      where: { id: id.toString() },
    });

    if (!foundUser)
      throw new UnauthorizedException('Email ou senha incorretos');

    const { password, ...secureUserData } = foundUser;
    return secureUserData;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.password) {
      const hashedPassword = await HashUtil.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }

    await this.prismaService.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async upddatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<void> {
    /* esse metodo tem como principal objetivo atualizar a senha do usuario, porem antes disso
    ele tem que verificar se a senha antiga é igual a senha atual, caso seja atualizar o campo password usando o newPassword do Dto */
    const user = await this.prismaService.users.findUnique({
      where: { id },
    });

    const currentPasswordValidation = await HashUtil.compare(
      updateUserPasswordDto.password,
      user.password,
    );

    if (!currentPasswordValidation)
      throw new UnprocessableEntityException('Senha atual está incorreta');

    const sameAsOldPassword =
      updateUserPasswordDto.password === updateUserPasswordDto.newPassword;

    if (sameAsOldPassword)
      throw new UnprocessableEntityException(
        'A nova senha não pode ser a mesma',
      );

    const hashedPassword = await HashUtil.hash(
      updateUserPasswordDto.newPassword,
    );

    user.password = hashedPassword;

    await this.prismaService.users.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.users.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
