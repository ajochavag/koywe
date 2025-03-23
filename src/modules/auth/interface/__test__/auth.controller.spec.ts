import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthFacade } from '../../application/service/auth.facade';
import { AuthService } from '../../application/service/auth.service';
import { USER_REPOSITORY } from '../../application/repository/user.repository';
import { CreateUserDto, LoginUserDto } from '../../application/dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthError } from '../../application/exceptions/auth.error.enum';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthController Integration Tests', () => {
  let controller: AuthController;
  let configService: ConfigService;

  const mockUserRepository = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const mockAccessToken = 'mock.access.token';
  const mockRefreshToken = 'mock.refresh.token';
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
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
    configService = module.get<ConfigService>(ConfigService);

    mockJwtService.sign.mockImplementation((_, options) => {
      if (options?.secret === configService.get('JWT_REFRESH_SECRET')) {
        return mockRefreshToken;
      }

      return mockAccessToken;
    });
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
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    };

    it('should register a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue({
        id: mockUserResponse.id,
        username: mockUserResponse.username,
        password: 'hashedPassword',
      });

      const response = await controller.register(createUserDto);

      expect(response).toEqual(mockUserResponse);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        createUserDto.username.toLowerCase().trim(),
      );
      expect(mockUserRepository.createUser).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
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

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      username: 'test@example.com',
      password: 'Test123!',
    };

    const mockUser = {
      id: crypto.randomUUID(),
      username: 'test@example.com',
      password: bcrypt.hashSync('Test123!', 10),
    };

    const mockUserResponse = {
      id: mockUser.id,
      username: mockUser.username,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    };

    it('should login a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const normalizedUsername = loginUserDto.username.toLowerCase().trim();

      const response = await controller.login(loginUserDto);

      expect(response).toEqual(mockUserResponse);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        normalizedUsername,
      );
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should return 401 Unauthorized when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(controller.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException(AuthError.INVALID_CREDENTIALS),
      );
    });

    it('should return 401 Unauthorized when password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        password: bcrypt.hashSync('WrongPassword', 10),
      });

      await expect(controller.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException(AuthError.INVALID_CREDENTIALS),
      );
    });

    it('should validate input DTO', async () => {
      const invalidDto = {
        username: 'invalid-email',
        password: '',
      };

      await expect(
        controller.login(invalidDto as LoginUserDto),
      ).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      token: mockRefreshToken,
    };

    const mockUser = {
      id: crypto.randomUUID(),
      username: 'test@example.com',
      password: 'hashedPassword',
    };

    const mockUserResponse = {
      id: mockUser.id,
      username: mockUser.username,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    };

    it('should refresh tokens successfully', async () => {
      const mockPayload = { username: mockUser.username };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const response = await controller.refreshToken(refreshTokenDto);

      expect(response).toEqual(mockUserResponse);
      expect(mockJwtService.verify).toHaveBeenCalledWith(
        refreshTokenDto.token,
        {
          secret: configService.get('JWT_REFRESH_SECRET'),
        },
      );
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should return 401 Unauthorized when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException(AuthError.INVALID_TOKEN),
      );
    });

    it('should return 401 Unauthorized when user not found', async () => {
      const mockPayload = { username: 'nonexistent@example.com' };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException(AuthError.INVALID_TOKEN),
      );
    });
  });
});
