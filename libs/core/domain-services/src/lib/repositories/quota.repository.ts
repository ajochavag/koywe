import { Quota } from '@monorepo/core-domain';

export abstract class QuotaRepository {
  abstract create(data: Quota): Promise<void>;
  abstract get(id: string): Promise<Quota | null>;
}
