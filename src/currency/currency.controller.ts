import { Body, Controller, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('api/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('convert-to-crypto')
  async convertToCrypto(
    @Body() body: { amount: number; currency: string; crypto: string },
  ) {
    return this.currencyService.convertToCrypto(
      body.amount,
      body.currency,
      body.crypto,
    );
  }

  @Post('convert-to-fiat')
  async convertToFiat(
    @Body() body: { amount: number; crypto: string; currency: string },
  ) {
    return this.currencyService.convertToFiat(
      body.amount,
      body.crypto,
      body.currency,
    );
  }

  @Post('quote')
  async createQuote(
    @Body() body: { amount: number; from: string; to: string },
  ) {
    return this.currencyService.createQuote(body.amount, body.from, body.to);
  }
  
}
