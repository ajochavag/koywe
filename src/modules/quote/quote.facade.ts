import { Injectable } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteBLL } from './quote.bll';
import { QuoteRepository } from './quote.repository';
import { QuoteProvider } from './quote.provider';

@Injectable()
export class QuoteFacade {
  constructor(
    private readonly bll: QuoteBLL,
    private readonly dal: QuoteRepository,
    private readonly provider: QuoteProvider,
    
  ) {}

  async createQuote(dto: QuoteDto) {
    const rate = await this.provider.getExchangeRate(dto.from, dto.to);
    const quote = this.bll.calculateQuote(dto, rate);
    await this.dal.createQuote(quote);
    return quote;
  }
}
