import { Inject, Injectable } from "@nestjs/common";
import { QuotePersistRepository } from "../domain/contracts/QuotePersistRepository";
import { Quote } from "../domain/class/Quote";

@Injectable()
export class QuoteGetter {
  constructor(@Inject('QuotePersistRepository')
  private readonly quotePersistRepository: QuotePersistRepository) { }

  async run(id: string): Promise<Quote> {
    return this.quotePersistRepository.searchById(id);
  }
}