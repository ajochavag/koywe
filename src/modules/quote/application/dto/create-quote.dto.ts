import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { currency } from '../../domain/currency.enum';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'Amount to convert',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Source currency',
    enum: currency,
    example: currency.USDC,
  })
  @IsEnum(currency)
  from: currency;

  @ApiProperty({
    description: 'Target currency',
    enum: currency,
    example: currency.CLP,
  })
  @IsEnum(currency)
  to: currency;
}
