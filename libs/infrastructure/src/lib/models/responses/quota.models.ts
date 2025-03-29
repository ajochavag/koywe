import { Expose } from 'class-transformer';

export class GetQuotaResponse {
  @Expose()
  id: string;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  amount: number;

  @Expose()
  rate: number;

  @Expose()
  convertedAmount: number;

  @Expose()
  timestamp: Date;

  @Expose()
  expiresAt: Date;
}
