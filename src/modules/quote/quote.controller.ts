import { Controller, Post, Body } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteFacade } from './quote.facade';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteFacade) {}

  @Post()
  async createQuote(@Body() dto: QuoteDto) {
    return this.quoteFacade.createQuote(dto);
  }
}

