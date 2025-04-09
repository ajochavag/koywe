import { QuoteService } from '../../quote.service';
import { QuoteProvider } from '../../quote.provider';
import { QuoteBLL } from '../../quote.bll';
import { QuoteRepository } from '../../quote.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteDto } from '../../dto/quote.dto';

describe('QuoteService', () => {
  let service: QuoteService;
  let provider: QuoteProvider;
  let bll: QuoteBLL;
  let repository: QuoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: QuoteProvider,
          useValue: { getExchangeRate: jest.fn() },
        },
        {
          provide: QuoteBLL,
          useValue: { calculateQuote: jest.fn() },
        },
        {
          provide: QuoteRepository,
          useValue: { createQuote: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    provider = module.get<QuoteProvider>(QuoteProvider);
    bll = module.get<QuoteBLL>(QuoteBLL);
    repository = module.get<QuoteRepository>(QuoteRepository);
  });

  it('debería crear una cotización correctamente', async () => {
    const dto: QuoteDto = { amount: 1000, from: 'ARS', to: 'ETH' };
    const rate = 0.0000023;
    const generatedQuote = {
        ...dto,
        rate,
        id: 'abc',
        convertedAmount: 0.0023,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };

    (provider.getExchangeRate as jest.Mock).mockResolvedValue(rate);
    (bll.calculateQuote as jest.Mock).mockReturnValue(generatedQuote);
    (repository.createQuote as jest.Mock).mockResolvedValue(generatedQuote);

    const result = await service.createQuote(dto);

    expect(provider.getExchangeRate).toHaveBeenCalledWith(dto.from, dto.to);
    expect(bll.calculateQuote).toHaveBeenCalledWith(dto, rate);
    expect(repository.createQuote).toHaveBeenCalledWith(generatedQuote);
    expect(result).toEqual(generatedQuote);
  });
});
