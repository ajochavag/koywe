import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacade } from '../auth.facade';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { AuthError } from '../../exceptions/auth.error.enum';
import * as crypto from 'node:crypto';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: AuthService;

  const mockAuthService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    facade = module.get<AuthFacade>(AuthFacade);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      username: 'test@example.com',
      password: 'Test123!',
    };

    const mockUserResponse = {
      id: crypto.randomUUID(),
      username: 'test@example.com',
      token: 'mock.jwt.token',
    };

    it('should delegate user creation to AuthService', async () => {
      mockAuthService.createUser.mockResolvedValue(mockUserResponse);

      const response = await facade.createUser(createUserDto);

      expect(authService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual(mockUserResponse);
    });

    it('should propagate error from AuthService when user already exists', async () => {
      const error = new ConflictException(AuthError.USER_ALREADY_EXISTS);
      mockAuthService.createUser.mockRejectedValue(error);

      await expect(facade.createUser(createUserDto)).rejects.toThrow(error);
    });

    it('should propagate error from AuthService when user creation fails', async () => {
      const error = new ConflictException(AuthError.FAILED_TO_CREATE_USER);
      mockAuthService.createUser.mockRejectedValue(error);

      await expect(facade.createUser(createUserDto)).rejects.toThrow(error);
    });
  });
});
