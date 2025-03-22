import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { QuoteService } from '../quote.service';
import {
  EXCHANGE_RATE_PROVIDER,
  ExchangeRateProvider,
} from '../../repository/exchange-rate.provider.interface';
import { CreateQuoteDto } from '../../dto/create-quote.dto';
import { currency } from '../../../domain/currency.enum';
import { QuoteError } from '../../exceptions/quote.error.enum';
import { QUOTE_REPOSITORY } from '../../repository/quote.repository';
import * as crypto from 'node:crypto';

describe('QuoteService', () => {
  let service: QuoteService;
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
      providers: [
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

    service = module.get<QuoteService>(QuoteService);
    exchangeRateProvider = module.get<ExchangeRateProvider>(
      EXCHANGE_RATE_PROVIDER,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuoteById', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const repositoryQuote = {
      id: crypto.randomUUID(),
      from: currency.USDC,
      to: currency.CLP,
      amount: 100,
      rate: 850.5,
      convertedAmount: 85050,
      timestamp: new Date('2025-01-01'),
      expiresAt: new Date('2025-01-01T00:05:00.000Z'),
    };

    it('should return a quote successfully', async () => {
      jest.setSystemTime(new Date('2025-01-01'));

      mockQuoteRepository.findOne.mockResolvedValue(repositoryQuote);

      const quote = await service.findOne(repositoryQuote.id);

      expect(quote.id).toBe(repositoryQuote.id);
      expect(quote.from).toBe(repositoryQuote.from);
      expect(quote.to).toBe(repositoryQuote.to);
      expect(quote.amount).toBe(repositoryQuote.amount);
      expect(quote.rate).toBe(repositoryQuote.rate);
      expect(quote.convertedAmount).toBe(repositoryQuote.convertedAmount);
      expect(quote.timestamp).toEqual(repositoryQuote.timestamp);
      expect(quote.expiresAt).toEqual(repositoryQuote.expiresAt);
    });

    it('should throw an error when quote is not found', async () => {
      mockQuoteRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(crypto.randomUUID())).rejects.toThrow(
        new NotFoundException(QuoteError.QUOTE_NOT_FOUND),
      );
    });

    it('should throw an error when quote is expired', async () => {
      jest.setSystemTime(new Date('2025-01-01T00:05:00.001Z'));

      mockQuoteRepository.findOne.mockResolvedValue(repositoryQuote);

      await expect(service.findOne(repositoryQuote.id)).rejects.toThrow(
        new GoneException(QuoteError.QUOTE_EXPIRED),
      );
    });

    it('should throw an error when failed to get quote', async () => {
      mockQuoteRepository.findOne.mockRejectedValue(new Error('API Error'));

      await expect(service.findOne(crypto.randomUUID())).rejects.toThrow(
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

      expect(mockQuoteRepository.create).toHaveBeenCalledWith(newQuote);

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
