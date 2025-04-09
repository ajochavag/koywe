import { Controller, Post, Body } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteService } from './quote.service';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteService) {}

  @Post()
  async createQuote(@Body() dto: QuoteDto) {
    return this.quoteFacade.createQuote(dto);
  }
}

