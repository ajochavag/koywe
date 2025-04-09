import { Injectable } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteBLL } from './quote.bll';
import { QuoteDAL } from './quote.dal';

@Injectable()
export class QuoteFacade {
  constructor(
    private readonly bll: QuoteBLL,
    private readonly dal: QuoteDAL,
  ) {}

  async createQuote(dto: QuoteDto) {
    const rate = await this.dal.getExchangeRate(dto.from, dto.to);
    return this.bll.calculateQuote(dto, rate);
  }
}
