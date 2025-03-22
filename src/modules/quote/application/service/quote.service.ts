import {
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import {
  EXCHANGE_RATE_PROVIDER,
  ExchangeRateProvider,
} from '../repository/exchange-rate.provider.interface';
import { Quote } from '../../domain/quote.domain';

import * as crypto from 'node:crypto';
import { QuoteError } from '../exceptions/quote.error.enum';
import {
  QUOTE_REPOSITORY,
  QuoteRepository,
} from '../repository/quote.repository';

@Injectable()
export class QuoteService {
  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly exchangeRateProvider: ExchangeRateProvider,
    @Inject(QUOTE_REPOSITORY)
    private readonly quoteRepository: QuoteRepository,
  ) {}

  async findOne(id: string): Promise<Quote> {
    try {
      const quote = await this.quoteRepository.findOne(id);

      if (!quote) {
        throw new NotFoundException(QuoteError.QUOTE_NOT_FOUND);
      }

      if (quote.expiresAt <= new Date()) {
        throw new GoneException(QuoteError.QUOTE_EXPIRED);
      }

      return quote;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof GoneException
      ) {
        throw error;
      }

      throw new ConflictException(QuoteError.FAILED_TO_GET_QUOTE);
    }
  }

  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const { amount, from, to } = createQuoteDto;

    try {
      const rate = await this.exchangeRateProvider.getRate(from, to);

      const rateValue = Number(rate[from].price);
      const convertedAmount = amount * rateValue;
      const timestamp = new Date();

      const quote = new Quote({
        id: crypto.randomUUID(),
        from,
        to,
        amount,
        rate: rateValue,
        convertedAmount,
        timestamp,
        expiresAt: new Date(timestamp.getTime() + 5 * 60 * 1000),
      });

      await this.quoteRepository.create(quote);

      return quote;
    } catch (error) {
      throw new ConflictException(QuoteError.FAILED_TO_CREATE_QUOTE);
    }
  }
}
