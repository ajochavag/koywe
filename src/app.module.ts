import { Module } from '@nestjs/common';
import { QuoteModule } from './modules/quote/quote.module';

@Module({
  imports: [QuoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
