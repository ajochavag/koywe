export interface ExchangeRateRepository {
  getRate(from: string, to: string): Promise<number>;
}
