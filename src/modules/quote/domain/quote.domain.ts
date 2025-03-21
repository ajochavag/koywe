import { Base } from 'src/modules/common/domain/base.domain';
import { currency } from './currency.enum';

export class Quote extends Base {
  from: currency;
  to: currency;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: Date;
  expiresAt: Date;

  constructor(quoteProps: Quote) {
    super();
    Object.assign(this, quoteProps);
  }
}
