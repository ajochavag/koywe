import { Cryptomkt } from '@monorepo/core-domain';

export abstract class CryptomktService {
  abstract get(from: string, to: string): Promise<Cryptomkt>;
}
