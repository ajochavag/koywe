import { Quote } from '../../domain/quote.domain';

export const QUOTE_REPOSITORY = 'QUOTE_REPOSITORY';

export interface QuoteRepository {
  findOne(id: string): Promise<Quote>;
  create(quote: Quote): Promise<Quote>;
}
