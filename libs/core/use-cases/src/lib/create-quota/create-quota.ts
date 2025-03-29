import { Quota } from '@monorepo/core-domain';
import { QuotaService } from '@monorepo/core-domain-services';
import { CryptomktService } from '@monorepo/infrastructure';
import { v4 as uuidv4 } from 'uuid';

export class CreateQuotaUseCase {
  constructor(private readonly cryptomktService: CryptomktService, private readonly quotaService: QuotaService) {}

  public async execute(quota: Partial<Quota>): Promise<Quota> {
    this.validateQuota(quota);

    const rate = await this.getExchangeRate(quota.from!, quota.to!);
    const convertedAmount = this.calculateConvertedAmount(quota.amount!, rate);
    const completeQuota = this.buildQuota(quota, rate, convertedAmount);

    await this.quotaService.create(completeQuota);

    return completeQuota;
  }

  private validateQuota(quota: Partial<Quota>): void {
    if (!quota.from || !quota.to) {
      throw new Error('Both "from" and "to" fields are required.');
    }
    if (!quota.amount) {
      throw new Error('"amount" field is required.');
    }
  }

  private async getExchangeRate(from: string, to: string): Promise<number> {
    const data = await this.cryptomktService.get(from, to);
    return parseFloat(data.price);
  }

  private calculateConvertedAmount(amount: number, rate: number): number {
    return amount * rate;
  }

  private buildQuota(quota: Partial<Quota>, rate: number, convertedAmount: number): Quota {
    const timestamp = new Date();

    return {
      id: uuidv4(),
      from: quota.from!,
      to: quota.to!,
      amount: quota.amount!,
      rate,
      convertedAmount,
      timestamp,
      expiresAt: new Date(timestamp.getTime() + 5 * 60 * 1000),
    };
  }
}
