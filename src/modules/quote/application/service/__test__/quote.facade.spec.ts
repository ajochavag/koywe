import { Test, TestingModule } from '@nestjs/testing';
import { QuoteFacade } from '../quote.facade';
import { QuoteService } from '../quote.service';
import { CreateQuoteDto } from '../../dto/create-quote.dto';
import { currency } from '../../../domain/currency.enum';
import { Quote } from '../../../domain/quote.domain';
import { QUOTE_REPOSITORY } from '../../repository/quote.repository';

describe('QuoteFacade', () => {
  let facade: QuoteFacade;
  let quoteService: QuoteService;

  const mockQuoteService = {
    create: jest.fn(),
  };

  const mockQuoteRepository = {
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

  describe('createQuote', () => {
    const createQuoteDto: CreateQuoteDto = {
      amount: 100,
      from: currency.USDC,
      to: currency.CLP,
    };

    const mockQuote: Quote = {
      id: '123',
      from: currency.USDC,
      to: currency.CLP,
      amount: 100,
      rate: 850.5,
      convertedAmount: 85050,
      timestamp: new Date('2025-01-01'),
      expiresAt: new Date('2025-01-01T00:05:00.000Z'),
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
