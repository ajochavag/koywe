import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { USER_REPOSITORY } from '../../repository/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { AuthError } from '../../exceptions/auth.error.enum';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const mockUser = {
        id: crypto.randomUUID(),
        username: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const response = await service.findOne('test@example.com');

      expect(response).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const response = await service.findOne('nonexistent@example.com');

      expect(response).toBeNull();
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      username: 'test@example.com',
      password: 'Test123!',
    };

    const mockUser = {
      id: crypto.randomUUID(),
      username: 'test@example.com',
      password: 'hashedPassword',
    };

    const mockToken = 'mock.jwt.token';

    beforeEach(() => {
      mockJwtService.sign.mockReturnValue(mockToken);
    });

    it('should create a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      const response = await service.createUser(createUserDto);

      expect(response).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        token: mockToken,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(mockUserRepository.createUser).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException(AuthError.USER_ALREADY_EXISTS),
      );
    });

    it('should throw ConflictException when user creation fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.createUser.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException(AuthError.FAILED_TO_CREATE_USER),
      );
    });
  });
});
