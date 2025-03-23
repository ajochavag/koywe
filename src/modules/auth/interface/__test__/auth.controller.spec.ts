import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthFacade } from '../../application/service/auth.facade';
import { AuthService } from '../../application/service/auth.service';
import { USER_REPOSITORY } from '../../application/repository/user.repository';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { AuthError } from '../../application/exceptions/auth.error.enum';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';

describe('AuthController Integration Tests', () => {
  let controller: AuthController;

  const mockUserRepository = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthFacade,
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      username: 'test@example.com',
      password: 'Test123!',
    };

    const mockUserResponse = {
      id: crypto.randomUUID(),
      username: 'test@example.com',
      token: 'mock.jwt.token',
    };

    beforeEach(() => {
      mockJwtService.sign.mockReturnValue(mockUserResponse.token);
    });

    it('should register a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue(mockUserResponse);

      const response = await controller.register(createUserDto);

      expect(response).toEqual(mockUserResponse);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(mockUserRepository.createUser).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
    });

    it('should return 409 Conflict when user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUserResponse);

      await expect(controller.register(createUserDto)).rejects.toThrow(
        new ConflictException(AuthError.USER_ALREADY_EXISTS),
      );
    });

    it('should return 409 Conflict when user creation fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.createUser.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        new ConflictException(AuthError.FAILED_TO_CREATE_USER),
      );
    });

    it('should validate input DTO', async () => {
      const invalidDto = {
        username: 'invalid-email',
        password: 'weak',
      };

      await expect(
        controller.register(invalidDto as CreateUserDto),
      ).rejects.toThrow();
    });
  });
});
