import { PrismaService } from './../prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashUtil } from 'src/common/utils/hashUtil';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(readonly prismaService: PrismaService) {}

  private readonly logger: Logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await HashUtil.hash(createUserDto.password, 12);
    createUserDto.password = hashedPassword;

    await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findOne(id: number): Promise<User | null> {
    const foundUser: User | null = await this.prismaService.user.findFirst({
      where: { id },
    });

    return foundUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
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
