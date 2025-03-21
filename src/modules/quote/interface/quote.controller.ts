import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuoteDto } from '../application/dto/create-quote.dto';
import { Quote } from '../domain/quote.domain';
import { QuoteFacade } from '../application/service/quote.facade';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteFacade) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return await this.quoteFacade.createQuote(createQuoteDto);
  }
}
