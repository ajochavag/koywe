import { currency } from './currency.enum';

export class Quote {
  id: string;
  from: currency;
  to: currency;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: Date;
  expiresAt: Date;

  constructor(quoteProps: Quote) {
    Object.assign(this, quoteProps);
  }
}
