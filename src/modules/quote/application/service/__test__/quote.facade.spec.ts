import { Test, TestingModule } from '@nestjs/testing';
import { QuoteFacade } from '../quote.facade';
import { QuoteService } from '../quote.service';
import { CreateQuoteDto } from '../../dto/create-quote.dto';
import { currency } from '../../../domain/currency.enum';
import { Quote } from '../../../domain/quote.domain';
import { QUOTE_REPOSITORY } from '../../repository/quote.repository';
import { QuoteError } from '../../exceptions/quote.error.enum';
import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'node:crypto';

describe('QuoteFacade', () => {
  let facade: QuoteFacade;
  let quoteService: QuoteService;

  const mockQuoteService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockQuoteRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteFacade,
        {
          provide: QuoteService,
          useValue: mockQuoteService,
        },
        {
          provide: QUOTE_REPOSITORY,
          useValue: mockQuoteRepository,
        },
      ],
    }).compile();

    facade = module.get<QuoteFacade>(QuoteFacade);
    quoteService = module.get<QuoteService>(QuoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockQuote: Quote = {
    id: crypto.randomUUID(),
    from: currency.USDC,
    to: currency.CLP,
    amount: 100,
    rate: 850.5,
    convertedAmount: 85050,
    timestamp: new Date('2025-01-01'),
    expiresAt: new Date('2025-01-01T00:05:00.000Z'),
  };

  describe('findOneQuote', () => {
    it('should delegate quote retrieval to QuoteService', async () => {
      mockQuoteService.findOne.mockResolvedValue(mockQuote);

      const result = await facade.findOneQuote(mockQuote.id);

      expect(quoteService.findOne).toHaveBeenCalledWith(mockQuote.id);
      expect(result).toEqual(mockQuote);
    });

    it('should propagate error from QuoteService when quote is not found', async () => {
      const error = new NotFoundException(QuoteError.QUOTE_NOT_FOUND);
      mockQuoteService.findOne.mockRejectedValue(error);

      await expect(facade.findOneQuote(mockQuote.id)).rejects.toThrow(error);
    });

    it('should propagate error from QuoteService when quote is expired', async () => {
      const error = new GoneException(QuoteError.QUOTE_EXPIRED);
      mockQuoteService.findOne.mockRejectedValue(error);

      await expect(facade.findOneQuote(mockQuote.id)).rejects.toThrow(error);
    });

    it('should propagate error from QuoteService when failed to get quote', async () => {
      const error = new ConflictException(QuoteError.FAILED_TO_GET_QUOTE);
      mockQuoteService.findOne.mockRejectedValue(error);

      await expect(facade.findOneQuote(mockQuote.id)).rejects.toThrow(error);
    });
  });

  describe('createQuote', () => {
    const createQuoteDto: CreateQuoteDto = {
      amount: 100,
      from: currency.USDC,
      to: currency.CLP,
    };

    it('should delegate quote creation to QuoteService', async () => {
      mockQuoteService.create.mockResolvedValue(mockQuote);

      const result = await facade.createQuote(createQuoteDto);

      expect(quoteService.create).toHaveBeenCalledWith(createQuoteDto);
      expect(result).toEqual(mockQuote);
    });

    it('should propagate errors from QuoteService', async () => {
      const error = new Error('Service error');
      mockQuoteService.create.mockRejectedValue(error);

      await expect(facade.createQuote(createQuoteDto)).rejects.toThrow(error);
    });
  });
});
