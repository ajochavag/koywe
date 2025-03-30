import { User } from '@monorepo/core-domain';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './user.repository';

jest.mock('@prisma/client');

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    repository = new PrismaUserRepository(prismaClient);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      const mockPrismaClient = {
        user: { create: jest.fn().mockResolvedValue(mockUser) },
      } as any;

      const repository = new PrismaUserRepository(mockPrismaClient);

      await expect(repository.create(mockUser)).resolves.not.toThrow();
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          id: mockUser.id,
          email: mockUser.email,
          password: mockUser.password,
        },
      });
    });

    it('should handle database error when creating user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      const mockPrismaClient = {
        user: { create: jest.fn().mockRejectedValue(new Error('Database error')) },
      } as any;

      const repository = new PrismaUserRepository(mockPrismaClient);

      await expect(repository.create(mockUser)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      const mockPrismaClient = {
        user: { findUnique: jest.fn().mockResolvedValue(mockUserData) },
      } as any;

      const repository = new PrismaUserRepository(mockPrismaClient);
      const result = await repository.findByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result?.id).toBe('1');
    });

    it('should return null when user not found', async () => {
      const mockPrismaClient = {
        user: { findUnique: jest.fn().mockResolvedValue(null) },
      } as any;

      const repository = new PrismaUserRepository(mockPrismaClient);
      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should handle database error when finding user', async () => {
      const mockPrismaClient = {
        user: { findUnique: jest.fn().mockRejectedValue(new Error('Database error')) },
      } as any;

      const repository = new PrismaUserRepository(mockPrismaClient);

      await expect(repository.findByEmail('test@example.com')).rejects.toThrow('Database error');
    });
  });
});
