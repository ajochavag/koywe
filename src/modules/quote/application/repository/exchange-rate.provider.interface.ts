import { currency } from '../../domain/currency.enum';

export const EXCHANGE_RATE_PROVIDER = 'EXCHANGE_RATE_PROVIDER';

export interface GetRateResponse {
  [key: string]: GetRateResponseCurrency; // key is the from currency value
}

interface GetRateResponseCurrency {
  currency: currency;
  price: string;
  timestamp: string;
}

export interface ExchangeRateProvider {
  getRate(from: string, to: string): Promise<GetRateResponse>;
}
