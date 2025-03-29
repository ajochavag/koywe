import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;
}
