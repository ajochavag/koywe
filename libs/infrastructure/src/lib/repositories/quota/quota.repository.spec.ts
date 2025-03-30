import { Quota } from '@monorepo/core-domain';
import { PrismaClient } from '@prisma/client';
import { PrismaQuotaRepository } from './quota.repository';

jest.mock('@prisma/client');

describe('PrismaQuotaRepository', () => {
  let repository: PrismaQuotaRepository;
  let prismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    repository = new PrismaQuotaRepository(prismaClient);
  });

  describe('create', () => {
    it('should create a quota successfully', async () => {
      const mockQuota = new Quota();
      mockQuota.id = '123';
      mockQuota.from = 'USD';
      mockQuota.to = 'EUR';
      mockQuota.amount = 100;
      mockQuota.rate = 0.85;
      mockQuota.convertedAmount = 85;
      mockQuota.timestamp = new Date();
      mockQuota.expiresAt = new Date();

      const mockPrismaClient = {
        quota: { create: jest.fn().mockResolvedValue(mockQuota) },
      } as any;

      const repository = new PrismaQuotaRepository(mockPrismaClient);

      await expect(repository.create(mockQuota)).resolves.not.toThrow();
      expect(mockPrismaClient.quota.create).toHaveBeenCalledWith({
        data: {
          id: mockQuota.id,
          from: mockQuota.from,
          to: mockQuota.to,
          amount: mockQuota.amount,
          rate: mockQuota.rate,
          convertedAmount: mockQuota.convertedAmount,
          timestamp: mockQuota.timestamp,
          expiresAt: mockQuota.expiresAt,
        },
      });
    });

    it('should handle database error when creating quota', async () => {
      const mockQuota = new Quota();
      mockQuota.id = '123';
      mockQuota.from = 'USD';
      mockQuota.to = 'EUR';
      mockQuota.amount = 100;
      mockQuota.rate = 0.85;
      mockQuota.convertedAmount = 85;
      mockQuota.timestamp = new Date();
      mockQuota.expiresAt = new Date();

      const mockPrismaClient = {
        quota: { create: jest.fn().mockRejectedValue(new Error('Database error')) },
      } as any;

      const repository = new PrismaQuotaRepository(mockPrismaClient);

      await expect(repository.create(mockQuota)).rejects.toThrow('Database error');
    });
  });

  describe('get', () => {
    it('should return quota when found', async () => {
      const mockQuotaData = {
        id: '123',
        from: 'USD',
        to: 'EUR',
        amount: 100,
        rate: 0.85,
        convertedAmount: 85,
        timestamp: new Date(),
        expiresAt: new Date(),
      };

      const mockPrismaClient = {
        quota: { findUnique: jest.fn().mockResolvedValue(mockQuotaData) },
      } as any;

      const repository = new PrismaQuotaRepository(mockPrismaClient);
      const result = await repository.get('123');

      expect(result).toBeDefined();
      expect(mockPrismaClient.quota.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result?.id).toBe('123');
    });

    it('should return null when quota not found', async () => {
      const mockPrismaClient = {
        quota: { findUnique: jest.fn().mockResolvedValue(null) },
      } as any;

      const repository = new PrismaQuotaRepository(mockPrismaClient);
      const result = await repository.get('nonexistent');

      expect(result).toBeNull();
      expect(mockPrismaClient.quota.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });

    it('should handle database error when getting quota', async () => {
      const mockPrismaClient = {
        quota: { findUnique: jest.fn().mockRejectedValue(new Error('Database error')) },
      } as any;

      const repository = new PrismaQuotaRepository(mockPrismaClient);

      await expect(repository.get('123')).rejects.toThrow('Database error');
    });
  });
});
