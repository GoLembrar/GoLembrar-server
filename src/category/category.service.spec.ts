import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            // Defina os métodos mock do PrismaService que o ReminderService usa
          },
        },
      ],
    }).compile();

    service = module.get(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
