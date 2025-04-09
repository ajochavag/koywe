import { Injectable } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuoteBLL {
  calculateQuote(dto: QuoteDto, rate: number) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 20 * 1000); // 20segundos

    return {
      id: uuid(),
      from: dto.from,
      to: dto.to,
      amount: dto.amount,
      rate,
      convertedAmount: +(dto.amount * rate).toFixed(6),
      timestamp: now,
      expiresAt: expiresAt,
    };
  }
}
