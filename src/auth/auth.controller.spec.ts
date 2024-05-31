import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';
import { vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const userToken = {
    token: 'token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        PrismaService,
        JwtService,
        {
          provide: AuthService,
          useValue: {
            login: async () => userToken,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token when user is authenticated', async () => {
      const userLogin: CredentialsDto = {
        email: 'email',
        password: 'password',
      };

      expect(await controller.login(userLogin)).toEqual(userToken);
    });

    it('should throw an error when user is not authenticated', async () => {
      vi.spyOn(authService, 'login').mockImplementation(() =>
        Promise.reject(new Error('Invalid credentials')),
      );

      const userLogin: CredentialsDto = {
        email: 'email1',
        password: 'password2',
      };

      try {
        await controller.login(userLogin);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });
});
