import { Module } from "@nestjs/common";
import { QuoteController } from "../controllers/quote.controller";
import { QuoteFacade } from "src/context/quote/application/QuoteFacade";
import { QuoteCreator } from "src/context/quote/application/QuoteCreator";
import { QuoteGetter } from "src/context/quote/application/QuoteGetter";
import { InfrastructureQuoteModule } from "src/context/quote/infrastructure/InfrastructureQuote.module";

@Module({
  imports: [InfrastructureQuoteModule],
  controllers: [QuoteController],
  providers: [QuoteCreator, QuoteGetter, QuoteFacade],
})
export class QuoteModule { }
