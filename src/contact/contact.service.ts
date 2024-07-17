import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Channel } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createContactDto: CreateContactDto) {
    const { userId, ...createData } = createContactDto;

    const channel = Channel[createData.channel.toUpperCase()];
    const contact = await this.prismaService.contact.create({
      data: {
        ...createData,
        user: {
          connect: { id: userId },
        },
        channel: channel,
      },
    });
    return contact;
  }

  async findAll(userId: string) {
    const contacts = await this.prismaService.contact.findMany({
      where: {
        userId: userId,
      },
    });
    return contacts;
  }

  async findOne(id: string, userId: string) {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const { userId, ...updateData } = updateContactDto;

    const channel = Channel[updateData.channel.toUpperCase()];
    const contact = await this.prismaService.contact.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!contact) {
      //retornar um Expception
      return new NotFoundException('Contato não encontrado');
    }

    const updatedContact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
        userId: contact.userId,
        name: contact.name,
        identify: contact.identify,
      },
      data: {
        ...updateData,
        channel,
      },
    });

    return updatedContact;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contact) {
      return false;
    }

    await this.prismaService.contact.delete({
      where: { ...contact },
    });

    return true;
  }
}
