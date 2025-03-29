import { Quota } from '@monorepo/core-domain';
import { QuotaRepository } from '@monorepo/core-domain-services';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetQuotaResponse } from '../../models';

export class PrismaQuotaRepository implements QuotaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(data: Quota): Promise<void> {
    await this.prisma.quota.create({
      data: {
        id: data.id,
        from: data.from,
        to: data.to,
        amount: data.amount,
        rate: data.rate,
        convertedAmount: data.convertedAmount,
        timestamp: data.timestamp,
        expiresAt: data.expiresAt,
      },
    });
  }

  public async get(id: string): Promise<Quota | null> {
    const quota = await this.prisma.quota.findUnique({
      where: { id },
    });

    return quota ? plainToInstance(GetQuotaResponse, quota, { excludeExtraneousValues: true }) : null;
  }
}
