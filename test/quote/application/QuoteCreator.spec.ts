
import { QuoteCreator } from "src/context/quote/application/QuoteCreator";
import { ExchangeRateRepository } from "src/context/quote/domain/contracts/ExchangeRateRepository";
import { QuotePersistRepository } from "src/context/quote/domain/contracts/QuotePersistRepository";
import { QuoteGenerator } from "../domain/QuoteGenerator";
import { BadRequestException } from "@nestjs/common";

describe('QuoteCreator', () => {
  let quoteCreator: QuoteCreator;
  let mockExchangeRateRepository: jest.Mocked<ExchangeRateRepository>;
  let mockQuotePersistRepository: jest.Mocked<QuotePersistRepository>;

  beforeEach(() => {
    mockExchangeRateRepository = { getRate: jest.fn() };
    mockQuotePersistRepository = { save: jest.fn(), searchById: jest.fn() };
    quoteCreator = new QuoteCreator(mockExchangeRateRepository, mockQuotePersistRepository);
  });

  it('should create quote and return quote response successfully', async () => {
    const generatedQuote = QuoteGenerator.generate();
    const { rate, from, to, amount } = generatedQuote

    mockExchangeRateRepository.getRate.mockResolvedValue(rate);
    mockQuotePersistRepository.save.mockResolvedValue(generatedQuote);

    const expected = await quoteCreator.run(from, to, amount);


    expect(mockExchangeRateRepository.getRate).toHaveBeenCalledWith(from, to);
    expect(mockQuotePersistRepository.save).toHaveBeenCalledWith(from, to, amount, rate, amount * rate);

    expect(expected).toBe(generatedQuote);
    expect(expected.convertedAmount).toBe(generatedQuote.amount * generatedQuote.rate);
  });

  it('should throw Error if exchange rate not exist', async () => {
    const from = 'EXCHANGE_RATE';
    const to = 'ETH';
    const amount = 1;

    mockExchangeRateRepository.getRate.mockImplementation(() => { throw new BadRequestException(`Exchange rate not available for ${from} to ${to}`) });

    await expect(quoteCreator.run(from, to, amount)).rejects.toThrow(BadRequestException);
    expect(mockExchangeRateRepository.getRate).toHaveBeenCalledWith(from, to);
    expect(mockQuotePersistRepository.save).not.toHaveBeenCalled();
  });
});