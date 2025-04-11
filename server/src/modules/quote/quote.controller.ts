import { UseGuards, Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteService } from './quote.service';
import { QuoteRepository } from './quote.repository';
import { JwtAuthGuard } from '../../authentication/guard/jwt-auth.guard';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly quoteRepo: QuoteRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuote(@Body() dto: QuoteDto) {
    return this.quoteService.createQuote(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getQuote(@Param('id') id: string) {
    return this.quoteRepo.getQuoteById(id);
  }
}
