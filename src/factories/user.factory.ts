import { Injectable } from '@nestjs/common';
import { FactoryService } from './facotry.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserFactory {
  constructor(
    private readonly factoryService: FactoryService,
    private readonly prismaService: PrismaService,
  ) {}

  public create(
    params?: {
      id?: string;
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
    },
    createOnDatabase: boolean = true,
  ) {
    const dataFactory = {
      id: params?.id ?? null, //will be generated on the database if not provided
      email: params?.email ?? this.factoryService.generateEmail(),
      password: params?.password ?? this.factoryService.generatePassword(),
      name: params?.name ?? this.factoryService.generateUserName(),
      phone: params?.phone ?? this.factoryService.generatePhoneNumber(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (createOnDatabase) {
      return this.prismaService.user.create({
        data: dataFactory,
      });
    }
    return dataFactory;
  }
}
