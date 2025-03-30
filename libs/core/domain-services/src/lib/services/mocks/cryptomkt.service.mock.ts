import { CryptomktService } from '../cryptomkt.service';

export const cryptomktServiceMock: CryptomktService = {
  get: (_from: string, _to: string) => Promise.resolve() as any,
};
