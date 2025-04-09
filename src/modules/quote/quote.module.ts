import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteFacade } from './quote.facade';
import { QuoteBLL } from './quote.bll';
import { QuoteDAL } from './quote.dal';

@Module({
  controllers: [QuoteController],
  providers: [QuoteFacade, QuoteBLL, QuoteDAL],
})
export class QuoteModule {}
