import { Quota } from '@monorepo/core-domain';

export abstract class QuotaService {
  abstract create(data: Quota): Promise<void>;
  abstract get(id: string): Promise<Quota | null>;
}
