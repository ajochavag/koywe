import { currency } from '@/modules/quote/domain/currency.enum';
import { Quote } from '@/modules/quote/domain/quote.domain';
import { Quote as RepositoryQuote } from '@prisma/client';

export class QuoteResponseMapper {
  fromRepositoryToQuote(quote: RepositoryQuote): Quote {
    const { createdAt, updatedAt, ...filteredQuote } = quote;

    return new Quote({
      ...filteredQuote,
      from: currency[filteredQuote.from],
      to: currency[filteredQuote.to],
    });
  }
}
