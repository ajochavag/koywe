import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyRateService } from './currency-rate.service';

// me aseguro que controlador y servicio esten registrados
@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyRateService]
})
export class CurrencyModule {}
