import { Quote } from '../../domain/quote.domain';

export const QUOTE_REPOSITORY = 'QUOTE_REPOSITORY';

export interface QuoteRepository {
  create(quote: Quote): Promise<Quote>;
}
