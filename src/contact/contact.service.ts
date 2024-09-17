import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Channel, Contact } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create(createContactDto: CreateContactDto) {
    const { userId, identify, ...createData } = createContactDto;

    const existingContact = await this.prismaService.contact.findFirst({
      where: {
        userId: userId,
        identify: identify,
        name: createData.name,
      },
    });

    if (existingContact) {
      throw new ConflictException(
        'Contact already exists for this user and identify',
      );
    }

    const channel = Channel[createData.channel.toUpperCase()];
    const contact = await this.prismaService.contact.create({
      data: {
        ...createData,
        identify,
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

  public async findOne(id: string, userId: string): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Não foi possível encontrar o contato');
    }

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
      throw new NotFoundException('Não foi possível encontrar o contato');
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

  public async remove(id: string, userId: string): Promise<boolean> {
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
      where: { id: contact.id },
      include: {
        UsersToReminder: true,
      },
    });

    return true;
  }

  public async removeAll(userId: string) {
    const contacts = await this.prismaService.contact.findMany({
      where: { userId: userId },
      select: { id: true },
    });

    if (contacts.length === 0) {
      throw new NotFoundException('Nenhum contato encontrado');
    }

    await this.prismaService.contact.deleteMany({
      where: { userId: userId },
    });

    return true;
  }

  public async findByName(name: string) {
    const cleanTerm = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();

    return this.prismaService.$queryRaw<Contact[]>`
      SELECT *
      FROM contacts
      WHERE contacts::text ~* ${cleanTerm}
      LIMIT 10
    `;
  }
}
