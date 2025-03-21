import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { QuoteService } from '../quote.service';
import {
  EXCHANGE_RATE_PROVIDER,
  ExchangeRateProvider,
} from '../../repository/exchange-rate.provider.interface';
import { CreateQuoteDto } from '../../dto/create-quote.dto';
import { currency } from '../../../domain/currency.enum';
import { QuoteError } from '../../exceptions/quote.error.enum';

describe('QuoteService', () => {
  let service: QuoteService;
  let exchangeRateProvider: ExchangeRateProvider;

  const mockExchangeRateProvider = {
    getRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: EXCHANGE_RATE_PROVIDER,
          useValue: mockExchangeRateProvider,
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
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

    const mockRate = {
      [currency.USDC]: {
        currency: currency.USDC,
        price: '850.5',
        timestamp: '2025-01-01T00:00:00.000Z',
      },
    };

    const mockRateValue = Number(mockRate[createQuoteDto.from].price);

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create a quote successfully', async () => {
      mockExchangeRateProvider.getRate.mockResolvedValue(mockRate);

      const newQuote = await service.create(createQuoteDto);

      expect(exchangeRateProvider.getRate).toHaveBeenCalledWith(
        createQuoteDto.from,
        createQuoteDto.to,
      );

      expect(newQuote.id).toBeDefined();
      expect(newQuote.from).toBe(createQuoteDto.from);
      expect(newQuote.to).toBe(createQuoteDto.to);
      expect(newQuote.amount).toBe(createQuoteDto.amount);
      expect(newQuote.rate).toBe(mockRateValue);
      expect(newQuote.convertedAmount).toBe(
        createQuoteDto.amount * mockRateValue,
      );
      expect(newQuote.timestamp).toEqual(new Date('2025-01-01'));
      expect(newQuote.expiresAt).toEqual(new Date('2025-01-01T00:05:00.000Z'));
    });

    it('should throw an error when create quote fails', async () => {
      mockExchangeRateProvider.getRate.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(service.create(createQuoteDto)).rejects.toThrow(
        new ConflictException(QuoteError.FAILED_TO_CREATE_QUOTE),
      );
    });
  });
});
