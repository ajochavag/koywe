import { AuthResponse } from '@monorepo/core-domain';
import { CreateUserUseCase, GetUserUseCase } from '@monorepo/core-use-cases';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let createUserUseCase: CreateUserUseCase;
  let getUserUseCase: GetUserUseCase;

  const authResponseMock: AuthResponse = {
    access_token: 'access_token',
    expires_in: 'expires_in',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(authResponseMock),
          },
        },
        {
          provide: GetUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(authResponseMock),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    createUserUseCase = app.get<CreateUserUseCase>(CreateUserUseCase);
    getUserUseCase = app.get<GetUserUseCase>(GetUserUseCase);
  });

  describe('register', () => {
    it('should create a new user and return auth response', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await controller.register(createUserDto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(authResponseMock);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(new Error('User creation failed'));

      await expect(controller.register(createUserDto)).rejects.toThrow('User creation failed');
    });
  });

  describe('login', () => {
    it('should authenticate user and return auth response', async () => {
      const loginUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const result = await controller.login(loginUserDto);

      expect(getUserUseCase.execute).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual(authResponseMock);
    });

    it('should throw an error if authentication fails', async () => {
      const loginUserDto = {
        email: 'test@test.com',
        password: 'wrong-password',
      };

      jest.spyOn(getUserUseCase, 'execute').mockRejectedValue(new Error('Authentication failed'));

      await expect(controller.login(loginUserDto)).rejects.toThrow('Authentication failed');
    });
  });
});
