import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteDto {
  @ApiProperty({ example: 'ARS', description: 'Source currency' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'ETH', description: 'Target currency' })
  @IsString()
  to: string;

  @ApiProperty({ example: 1000, description: 'Amount to convert' })
  @IsNumber()
  amount: number;
}
