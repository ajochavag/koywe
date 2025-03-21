import { IsEnum, IsNumber, IsString } from 'class-validator';
import { currency } from '../../domain/currency.enum';

export class CreateQuoteDto {
  @IsNumber()
  amount: number;

  @IsEnum(currency)
  from: currency;

  @IsEnum(currency)
  to: currency;
}
