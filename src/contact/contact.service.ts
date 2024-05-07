import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createContactDto: CreateContactDto) {
    console.log(createContactDto);
    const contact = await this.prismaService.contact.create({
      data: createContactDto,
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
    /* const contact = await this.prismaService.contact.update({
      where: {
        id: id,
      },
      data: {
        ...updateContactDto,
      },
    });

    return contact; */
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
