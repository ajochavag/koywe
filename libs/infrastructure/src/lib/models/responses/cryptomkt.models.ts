import { Cryptomkt } from '@monorepo/core-domain';
import { Expose } from 'class-transformer';

export class CryptomktResponse implements Cryptomkt {
  @Expose()
  currency: string;

  @Expose()
  price: string;

  @Expose()
  timestamp: Date;
}
