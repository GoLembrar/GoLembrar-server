import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashUtil } from '../common/utils/hashUtil';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(readonly prismaService: PrismaService) {}

  private readonly logger: Logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email ja cadastrado', HttpStatus.CONFLICT);
    }

    const regex = /^(?=.*[A-Z]).{6,24}$/;
    const isPasswordValid = regex.test(createUserDto.password);

    if (!isPasswordValid) {
      throw new HttpException(
        'A senha deve ter entre 6 e 24 caracteres e pelo menos uma letra maiúscula.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await HashUtil.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findOne(id: string) {
    const foundUser = await this.prismaService.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!foundUser)
      throw new UnauthorizedException('Email ou senha incorretos');

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.password) {
      const hashedPassword = await HashUtil.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }

    await this.prismaService.user.update({
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
    const user = await this.prismaService.user.findUnique({
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

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: user,
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
