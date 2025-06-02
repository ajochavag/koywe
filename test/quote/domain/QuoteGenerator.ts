import { Quote } from "src/context/quote/domain/class/quote";

export class QuoteGenerator {
  static generate(): Quote {
    return new Quote(
      'abc123',
      'ETH',
      'ARS',
      100,
      3049099,
      304909900,
      new Date().toISOString(),
      new Date(Date.now() + 300000).toISOString()
    );
  }
}