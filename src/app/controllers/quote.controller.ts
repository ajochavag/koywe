import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuoteFacade } from "src/context/quote/application/QuoteFacade";
import { QuoteDto } from "../dto/QuoteDto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Quote } from "src/context/quote/domain/class/Quote";

@ApiTags('Quote')
@Controller('quote')
export class QuoteController {
  constructor(private facade: QuoteFacade) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async createQuote(@Body() { from, to, amount }: QuoteDto): Promise<Quote> {
    return await this.facade.createQuote(from, to, amount);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getQuote(@Param('id') id: string) {
    return this.facade.getQuote(id);
  }

}