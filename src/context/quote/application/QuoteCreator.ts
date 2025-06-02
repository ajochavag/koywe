import { Inject, Injectable } from "@nestjs/common";
import { ExchangeRateRepository } from "../domain/contracts/ExchangeRateRepository";
import { QuotePersistRepository } from "../domain/contracts/QuotePersistRepository";
import { Quote } from "../domain/class/Quote";

@Injectable()
export class QuoteCreator {
  constructor(
    @Inject('ExchangeRateRepository')
    private readonly exchangeRateRepository: ExchangeRateRepository,
    @Inject('QuotePersistRepository')
    private readonly quotePersistRepository: QuotePersistRepository
  ) { }

  async run(from: string, to: string, amount: number): Promise<Quote> {
    const rate = await this.exchangeRateRepository.getRate(from, to);
    return this.quotePersistRepository.save(from, to, amount, rate, rate * amount);
  }
}