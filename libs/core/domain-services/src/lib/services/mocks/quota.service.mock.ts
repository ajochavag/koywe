import { Quota } from '@monorepo/core-domain';
import { QuotaService } from '../quota.service';

export const quotaServiceMock: QuotaService = {
  create: (_data: Quota) => Promise.resolve() as any,
  get: (_id: string) => Promise.resolve() as any,
};
