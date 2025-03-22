import { Injectable } from '@nestjs/common';
import { QuoteRepository as IQuoteRepository } from '../../application/repository/quote.repository';
import { PrismaService } from '@/modules/common/infrastructure/prisma/prisma.service';
import { Quote } from '../../domain/quote.domain';
import { QuoteResponseMapper } from '../../application/mapper/response/quote.response.mapper';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly quoteResponseMapper: QuoteResponseMapper,
  ) {}

  async findOne(id: string): Promise<Quote | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return null;
    }

    return this.quoteResponseMapper.fromRepositoryToQuote(quote);
  }

  async create(data: Quote): Promise<Quote> {
    await this.prisma.quote.create({
      data,
    });

    return data;
  }
}
