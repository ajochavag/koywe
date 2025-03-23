import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateQuoteDto } from '../application/dto/create-quote.dto';
import { Quote } from '../domain/quote.domain';
import { QuoteFacade } from '../application/service/quote.facade';
import { AuthGuard } from '@nestjs/passport';

@Controller('quote')
@UseGuards(AuthGuard())
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteFacade) {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Quote> {
    return await this.quoteFacade.findOneQuote(id);
  }

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return await this.quoteFacade.createQuote(createQuoteDto);
  }
}
