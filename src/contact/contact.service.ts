import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Platforms } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createContactDto: CreateContactDto) {
    const { userId, ...createData } = createContactDto;

    const platform = Platforms[createData.platform.toUpperCase()];
    const contact = await this.prismaService.contact.create({
      data: {
        ...createData,
        user: {
          connect: { id: userId },
        },
        platform,
      },
    });
    return contact;
  }

  async findAll(userId: number) {
    const contacts = await this.prismaService.contact.findMany({
      where: {
        userId: userId,
      },
    });
    return contacts;
  }

  async findOne(id: number, userId: number) {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const { userId, ...updateData } = updateContactDto;

    const platform = Platforms[updateData.platform.toUpperCase()];
    const contact = await this.prismaService.contact.update({
      where: {
        id: id,
      },
      data: {
        ...updateData,
        user: { connect: { id: userId } },
        platform,
      },
    });

    return contact;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const contact = await this.prismaService.contact.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!contact) {
      return false;
    }
    return true;
  }
}
