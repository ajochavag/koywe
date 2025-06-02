import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoMktExchangeRepository } from './repository/CryptoMktExchangeRepository';
import { QuotePersistMongoRepository } from './repository/QuotePersistMongoRepository';
import { QuoteSchema } from './repository/models/QuoteModel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'quotes', schema: QuoteSchema }]),
  ],
  providers: [
    {
      provide: 'ExchangeRateRepository',
      useClass: CryptoMktExchangeRepository,
    },
    {
      provide: 'QuotePersistRepository',
      useClass: QuotePersistMongoRepository,
    },
  ],
  exports: [
    'ExchangeRateRepository',
    'QuotePersistRepository',
  ],
})

export class InfrastructureQuoteModule { }
