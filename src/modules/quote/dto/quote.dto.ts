import { IsNumber, IsString, IsIn } from 'class-validator';

export class QuoteDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(['ARS', 'CLP', 'MXN', 'USDC', 'BTC', 'ETH'])
  from: string;

  @IsString()
  @IsIn(['ARS', 'CLP', 'MXN', 'USDC', 'BTC', 'ETH'])
  to: string;
}