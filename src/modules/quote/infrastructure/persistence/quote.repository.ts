import { Injectable } from '@nestjs/common';
import { QuoteRepository as IQuoteRepository } from '../../application/repository/quote.repository';
import { PrismaService } from 'src/modules/common/infrastructure/prisma/prisma.service';
import { Quote } from '../../domain/quote.domain';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Quote): Promise<Quote> {
    await this.prisma.quote.create({
      data,
    });

    return data;
  }
}
