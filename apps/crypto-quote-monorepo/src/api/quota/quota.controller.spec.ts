import { Quota } from '@monorepo/core-domain';
import { CreateQuotaUseCase, GetQuotaUseCase } from '@monorepo/core-use-cases';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { QuotaController } from './quota.controller';

describe('QuotaController', () => {
  let controller: QuotaController;
  let createQuotaUseCase: CreateQuotaUseCase;
  let getQuotaUseCase: GetQuotaUseCase;

  const quotaMock: Quota = {
    id: 'test-id-123',
    from: 'BTC',
    to: 'USD',
    amount: 1.5,
    rate: 30000,
    convertedAmount: 45000,
    timestamp: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateQuotaUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(quotaMock),
          },
        },
        {
          provide: GetQuotaUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(quotaMock),
          },
        },
      ],
      controllers: [QuotaController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<QuotaController>(QuotaController);
    createQuotaUseCase = module.get<CreateQuotaUseCase>(CreateQuotaUseCase);
    getQuotaUseCase = module.get<GetQuotaUseCase>(GetQuotaUseCase);
  });

  describe('create', () => {
    it('should create a new quota successfully', async () => {
      const createQuoteDto = {
        from: 'BTC',
        to: 'USD',
        amount: 1.5,
      };

      const result = await controller.create(createQuoteDto);

      expect(createQuotaUseCase.execute).toHaveBeenCalledWith(createQuoteDto);
      expect(result).toEqual(quotaMock);
    });

    it('should throw error when creation fails', async () => {
      const createQuoteDto = {
        from: 'INVALID',
        to: 'USD',
        amount: 1.5,
      };

      jest.spyOn(createQuotaUseCase, 'execute').mockRejectedValue(new Error('Invalid currency'));

      await expect(controller.create(createQuoteDto)).rejects.toThrow('Invalid currency');
    });
  });

  describe('get', () => {
    it('should get quota by id successfully', async () => {
      const id = 'test-id-123';

      const result = await controller.get(id);

      expect(getQuotaUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(quotaMock);
    });

    it('should throw error when quota not found', async () => {
      const id = 'non-existent-id';

      jest.spyOn(getQuotaUseCase, 'execute').mockRejectedValue(new Error('Quota not found'));

      await expect(controller.get(id)).rejects.toThrow('Quota not found');
    });

    it('should throw error with invalid id format', async () => {
      const id = '';

      jest.spyOn(getQuotaUseCase, 'execute').mockRejectedValue(new Error('Invalid ID format'));

      await expect(controller.get(id)).rejects.toThrow('Invalid ID format');
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
