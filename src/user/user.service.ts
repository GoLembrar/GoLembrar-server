/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashUtil } from '../common/utils/hashUtil';
import { Users } from '@prisma/client';

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

  async findOne(id: number): Promise<Partial<Users> | null> {
    const foundUser: Users | null = await this.prismaService.users.findFirst({
      where: { id },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...secureUserData } = foundUser;
    return secureUserData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.prismaService.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<void> {
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
