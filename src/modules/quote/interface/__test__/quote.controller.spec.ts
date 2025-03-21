import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from '../quote.controller';
import { QuoteFacade } from '../../application/service/quote.facade';
import { QuoteService } from '../../application/service/quote.service';
import {
  EXCHANGE_RATE_PROVIDER,
  ExchangeRateProvider,
} from '../../application/repository/exchange-rate.provider.interface';
import { CreateQuoteDto } from '../../application/dto/create-quote.dto';
import { currency } from '../../domain/currency.enum';
import { ConflictException } from '@nestjs/common';
import { QuoteError } from '../../application/exceptions/quote.error.enum';

describe('QuoteController Integration Tests', () => {
  let controller: QuoteController;
  let exchangeRateProvider: ExchangeRateProvider;

  const mockExchangeRateProvider = {
    getRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        QuoteFacade,
        QuoteService,
        {
          provide: EXCHANGE_RATE_PROVIDER,
          useValue: mockExchangeRateProvider,
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
    exchangeRateProvider = module.get<ExchangeRateProvider>(
      EXCHANGE_RATE_PROVIDER,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createQuoteDto: CreateQuoteDto = {
      amount: 100,
      from: currency.USDC,
      to: currency.CLP,
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create a quote successfully', async () => {
      const mockRate = {
        [currency.USDC]: {
          currency: currency.USDC,
          price: '850.5',
          timestamp: '2025-01-01T00:00:00.000Z',
        },
      };

      const mockRateValue = Number(mockRate[createQuoteDto.from].price);

      mockExchangeRateProvider.getRate.mockResolvedValue(mockRate);

      const result = await controller.create(createQuoteDto);

      expect(exchangeRateProvider.getRate).toHaveBeenCalledWith(
        createQuoteDto.from,
        createQuoteDto.to,
      );

      expect(result.id).toBeDefined();
      expect(result.from).toBe(createQuoteDto.from);
      expect(result.to).toBe(createQuoteDto.to);
      expect(result.amount).toBe(createQuoteDto.amount);
      expect(result.rate).toBe(mockRateValue);
      expect(result.convertedAmount).toBe(
        createQuoteDto.amount * mockRateValue,
      );
      expect(result.timestamp).toEqual(new Date('2025-01-01'));
      expect(result.expiresAt).toEqual(new Date('2025-01-01T00:05:00.000Z'));
    });

    it('should return 409 Conflict when quote creation fails', async () => {
      mockExchangeRateProvider.getRate.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(controller.create(createQuoteDto)).rejects.toThrow(
        new ConflictException(QuoteError.FAILED_TO_CREATE_QUOTE),
      );
    });

    it('should validate input DTO', async () => {
      const invalidDto = {
        amount: -100,
        from: 'INVALID_CURRENCY',
        to: currency.CLP,
      };

      await expect(
        controller.create(invalidDto as CreateQuoteDto),
      ).rejects.toThrow();
    });
  });
});
