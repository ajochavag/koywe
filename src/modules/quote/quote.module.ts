import { Module } from '@nestjs/common';
import { QuoteService } from './application/service/quote.service';
import { QuoteController } from './interface/quote.controller';
import { EXCHANGE_RATE_PROVIDER } from './application/repository/exchange-rate.provider.interface';
import { CryptomktProvider } from './infrastructure/providers/cryptomkt/cryptomkt.provider';
import { QuoteFacade } from './application/service/quote.facade';

@Module({
  controllers: [QuoteController],
  providers: [
    QuoteService,
    QuoteFacade,
    {
      provide: EXCHANGE_RATE_PROVIDER,
      useClass: CryptomktProvider,
    },
  ],
})
export class QuoteModule {}
