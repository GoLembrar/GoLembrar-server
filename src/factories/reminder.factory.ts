import { Injectable } from '@nestjs/common';
import { FactoryService } from './facotry.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReminderFactory {
  public constructor(
    private readonly factoryService: FactoryService,
    private readonly prismaService: PrismaService,
  ) {}
  public create(params?: {
    id?: string;
    title?: string;
    description?: string;
    scheduled?: Date;
    isActivated?: boolean;
    ownerId?: string;
    usersToReminder?: string[];
  }) {
    return {
      id: params?.id ?? null, //generate automatically on the database if not provided
      title: params?.title ?? this.factoryService.generateWords(3),
      description: params?.description ?? this.factoryService.generateWords(5),
      scheduled: params?.scheduled ?? this.factoryService.generatePastDate(),
      isActivated: params?.isActivated ?? true,
      ownerId: params?.ownerId ?? this.factoryService.generateUUID(),
      usersToReminder: params?.usersToReminder ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
