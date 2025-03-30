import { quotaMock } from '@monorepo/core-domain';
import { QuotaRepository } from '@monorepo/core-domain-services';
import { QuotaServiceImpl } from './quota.service';

describe('QuotaServiceImpl', () => {
  let service: QuotaServiceImpl;
  let repository: jest.Mocked<QuotaRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      get: jest.fn(),
    } as jest.Mocked<QuotaRepository>;

    service = new QuotaServiceImpl(repository);
  });

  describe('create', () => {
    it('should call repository create method with quota data', async () => {
      await service.create(quotaMock);
      expect(repository.create).toHaveBeenCalledWith(quotaMock);
    });
  });

  describe('get', () => {
    it('should return quota when found', async () => {
      repository.get.mockResolvedValue(quotaMock);
      const result = await service.get(quotaMock.id);
      expect(result).toEqual(quotaMock);
      expect(repository.get).toHaveBeenCalledWith(quotaMock.id);
    });

    it('should return null when quota not found', async () => {
      repository.get.mockResolvedValue(null);
      const result = await service.get('non-existent-id');
      expect(result).toBeNull();
      expect(repository.get).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
