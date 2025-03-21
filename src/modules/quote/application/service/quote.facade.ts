import { Injectable } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { Quote } from '../../domain/quote.domain';

@Injectable()
export class QuoteFacade {
  constructor(private readonly quoteService: QuoteService) {}

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return await this.quoteService.create(createQuoteDto);
  }
}
