import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteService } from './quote.service';
import { QuoteRepository } from './quote.repository';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly quoteFacade: QuoteService,
    private readonly quoteRepo: QuoteRepository
  ) {}

  @Post()
  async createQuote(@Body() dto: QuoteDto) {
    return this.quoteFacade.createQuote(dto);
  }

  @Get(':id')
  async getQuote(@Param('id') id: string) {
    return this.quoteRepo.getQuoteById(id);
  }
}

