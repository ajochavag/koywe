import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteBLL } from './quote.bll';
import { QuoteRepository } from './quote.repository';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, QuoteBLL, QuoteRepository],
})
export class QuoteModule {}
