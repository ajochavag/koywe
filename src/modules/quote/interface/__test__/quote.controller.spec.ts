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
import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { QuoteError } from '../../application/exceptions/quote.error.enum';
import { QUOTE_REPOSITORY } from '../../application/repository/quote.repository';
import { PassportModule } from '@nestjs/passport';
import * as crypto from 'node:crypto';

describe('QuoteController Integration Tests', () => {
  let controller: QuoteController;
  let exchangeRateProvider: ExchangeRateProvider;

  const mockExchangeRateProvider = {
    getRate: jest.fn(),
  };

  const mockQuoteRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [QuoteController],
      providers: [
        QuoteFacade,
        QuoteService,
        {
          provide: EXCHANGE_RATE_PROVIDER,
          useValue: mockExchangeRateProvider,
        },
        {
          provide: QUOTE_REPOSITORY,
          useValue: mockQuoteRepository,
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
    exchangeRateProvider = module.get<ExchangeRateProvider>(
      EXCHANGE_RATE_PROVIDER,
    );
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    const mockQuote = {
      id: crypto.randomUUID(),
      amount: 100,
      from: currency.USDC,
      to: currency.CLP,
      rate: 850.5,
      convertedAmount: 85050,
      timestamp: new Date('2025-01-01'),
      expiresAt: new Date('2025-01-01T00:05:00.000Z'),
    };

    it('should return a quote successfully', async () => {
      jest.setSystemTime(new Date('2025-01-01'));

      mockQuoteRepository.findOne.mockResolvedValue(mockQuote);

      const response = await controller.findOne(mockQuote.id);

      expect(response).toEqual(mockQuote);
    });

    it('should return 404 Not Found when quote is not found', async () => {
      mockQuoteRepository.findOne.mockResolvedValue(null);

      await expect(controller.findOne(crypto.randomUUID())).rejects.toThrow(
        new NotFoundException(QuoteError.QUOTE_NOT_FOUND),
      );
    });

    it('should return 410 Gone when quote is expired', async () => {
      jest.setSystemTime(new Date('2025-01-01T00:05:00.001Z'));

      mockQuoteRepository.findOne.mockResolvedValue(mockQuote);

      await expect(controller.findOne(mockQuote.id)).rejects.toThrow(
        new GoneException(QuoteError.QUOTE_EXPIRED),
      );
    });

    it('should return 409 Conflict when failed to get quote', async () => {
      mockQuoteRepository.findOne.mockRejectedValue(new Error('API Error'));

      await expect(controller.findOne(crypto.randomUUID())).rejects.toThrow(
        new ConflictException(QuoteError.FAILED_TO_GET_QUOTE),
      );
    });
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
