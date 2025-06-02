
import { ExchangeRateRepository } from "src/context/quote/domain/contracts/ExchangeRateRepository";
import { QuotePersistRepository } from "src/context/quote/domain/contracts/QuotePersistRepository";
import { QuoteGenerator } from "../domain/QuoteGenerator";
import { BadRequestException } from "@nestjs/common";
import { QuoteGetter } from "src/context/quote/application/QuoteGetter";
import { Quote } from "src/context/quote/domain/class/Quote";

describe('QuoteCreator', () => {
  let quoteGetter: QuoteGetter;
  let mockQuotePersistRepository: jest.Mocked<QuotePersistRepository>;

  beforeEach(() => {
    mockQuotePersistRepository = { save: jest.fn(), searchById: jest.fn() };
    quoteGetter = new QuoteGetter(mockQuotePersistRepository);
  });

  it('should return a quote', async () => {
    const quote = QuoteGenerator.generate()
    mockQuotePersistRepository.searchById.mockResolvedValue(quote);

    const expected = await quoteGetter.run(quote.id);

    expect(mockQuotePersistRepository.searchById).toHaveBeenCalledWith(quote.id);
    expect(expected).toBeInstanceOf(Quote);
    expect(expected).toBe(quote);
    expect(expected.id).toBe(quote.id);

  });
});