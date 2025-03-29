import { Quota, QuotaExpiredException, QuotaNotFoundException } from '@monorepo/core-domain';
import { QuotaService } from '@monorepo/core-domain-services';

export class GetQuotaUseCase {
  constructor(private readonly quotaService: QuotaService) {}

  public async execute(id: string): Promise<Quota> {
    const quota = await this.quotaService.get(id);

    if (!quota) {
      throw new QuotaNotFoundException(id);
    }

    if (this.isQuotaExpired(quota)) {
      throw new QuotaExpiredException(id);
    }

    return quota;
  }

  private isQuotaExpired(quota: Quota): boolean {
    return new Date() > quota.expiresAt;
  }
}
