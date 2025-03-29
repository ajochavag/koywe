import { Quota } from '@monorepo/core-domain';
import { QuotaRepository, QuotaService } from '@monorepo/core-domain-services';

export class QuotaServiceImpl implements QuotaService {
  constructor(private readonly quotaRepository: QuotaRepository) {
    /**/
  }

  public async create(data: Quota): Promise<void> {
    return await this.quotaRepository.create(data);
  }

  public async get(id: string): Promise<Quota | null> {
    return await this.quotaRepository.get(id);
  }
}
