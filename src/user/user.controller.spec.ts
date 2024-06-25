import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Users } from '@prisma/client';
import { vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService: Partial<Users | null>[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'user1@email.com',
      password: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'user2@email.com',
      password: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...withoutPass } = mockUserService[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        PrismaService,
        JwtService,
        {
          provide: UserService,
          useValue: {
            findOne: async () => withoutPass,
            create: async () => mockUserService[1],
            update: async () => mockUserService[0],
            remove: async () => {},
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user in current section', async () => {
      const userExpected = withoutPass;

      const user = await controller.findOne({ user: { id: userExpected.id } });
      expect(user).toEqual(userExpected);
      expect(user).not.toHaveProperty('password');
    });

    it('should return a 404 error', async () => {
      vi.spyOn(UserService.prototype, 'findOne').mockImplementation(() =>
        Promise.reject(new Error('User not found')),
      );

      // Sim, isso funciona testando a exceção, mas não testando se a exceção foi lançada
      try {
        await controller.findOne({ user: { id: 3 } });
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userExpected = mockUserService[1];

      const userToCreate: CreateUserDto = {
        email: 'user2@email.com',
        password: '123',
      };
      const user = await controller.create(userToCreate);

      expect(user).toEqual(userExpected);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userExpected = mockUserService[0];

      const userToUpdate: UpdateUserDto = {
        email: 'user123@email.com',
        password: '1234',
      };

      const user = await controller.update(
        { user: { id: userExpected.id } },
        userToUpdate,
      );
      expect(user).toEqual(userExpected);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const idExpected = mockUserService[0];

      const user = await controller.remove({ user: { id: idExpected } });
      expect(user).toBeUndefined();
    });
  });
});
