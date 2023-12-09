import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.generateHashedPassword(
      createUserDto.password,
    );
    createUserDto.password = hashedPassword;
    await this.prismaService.user.create({
      data: createUserDto,
      select: {
        email: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
