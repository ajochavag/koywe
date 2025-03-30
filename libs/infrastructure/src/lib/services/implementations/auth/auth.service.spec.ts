import { authResponseMock, User } from '@monorepo/core-domain';
import { UserService } from '@monorepo/core-domain-services';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthServiceImpl } from './auth.service';

jest.mock('@nestjs/jwt');
jest.mock('bcryptjs');

describe('AuthServiceImpl', () => {
  let authService: AuthServiceImpl;
  let userService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    (JwtService as jest.Mock).mockImplementation(() => ({
      sign: jest.fn().mockReturnValue(authResponseMock.access_token),
    }));

    (bcrypt.compare as jest.Mock).mockImplementation(() => Promise.resolve(true));
    (bcrypt.genSalt as jest.Mock).mockImplementation(() => Promise.resolve('salt'));
    (bcrypt.hash as jest.Mock).mockImplementation(() => Promise.resolve('hashedPassword'));

    authService = new AuthServiceImpl(userService);
  });

  describe('login', () => {
    it('should return auth response when credentials are valid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual(authResponseMock);
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create user and return auth response', async () => {
      userService.create.mockResolvedValue(mockUser);

      const result = await authService.register('test@example.com', 'password123');

      expect(result).toEqual(authResponseMock);
      expect(userService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
    });

    it('should throw UnauthorizedException when user creation fails', async () => {
      userService.create.mockResolvedValue(null);

      await expect(authService.register('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('get', () => {
    it('should return user when found', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.get('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await authService.get('test@example.com');

      expect(result).toBeNull();
    });
  });
});
