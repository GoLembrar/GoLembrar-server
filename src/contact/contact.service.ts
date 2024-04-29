import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createContactDto: CreateContactDto) {
    return 'This action adds a new contact';
  }

  async findAll(userId: number) {
    const contacts = await this.prismaService.contact.findMany({
      where: {
        userId: userId,
      },
    });
    return contacts;
  }

  findOne(id: number) {
    return `This action returns a #${id} contact`;
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
