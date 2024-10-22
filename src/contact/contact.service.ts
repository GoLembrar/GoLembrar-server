import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Channel, Contact, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { isEmailFormatValid } from '../common/utils/isEmailFormatValid';

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
        'Já existe um contato que possui o mesmo nome e identificador',
      );
    }

    const channel = Channel[createData.channel.toUpperCase()];

    if (channel === 'EMAIL') {
      const emailValidation = isEmailFormatValid(createContactDto.identify);

      if (!emailValidation) {
        throw new BadRequestException(
          'O formato de email informado é inválido',
        );
      }
    }

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

  async findAll(userId: string, search?: string) {
    const whereClause: Prisma.ContactWhereInput = {
      userId,
    };

    if (search)
      whereClause.name = {
        contains: search,
        mode: 'insensitive',
      };

    return await this.prismaService.contact.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
    });
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

  /**
   * Remove multiple contacts for a given user.
   *
   * @param ids - An array of contact IDs to be removed.
   * @param userId - The ID of the user who owns the contacts.
   * @returns A boolean indicating whether the operation was successful.
   */
  public async removeMany(ids: string[], userId: string): Promise<boolean> {
    // Find all contacts that match the given IDs and belong to the specified user
    const contacts = await this.prismaService.contact.findMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    });

    // If no matching contacts are found, return false
    if (contacts.length === 0) {
      return false;
    }

    // Delete all contacts that match the given IDs and belong to the specified user
    await this.prismaService.contact.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    });

    // Return true to indicate successful deletion
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
}
