import { Injectable } from "@nestjs/common";
import { QuoteCreator } from "./QuoteCreator";
import { QuoteGetter } from "./QuoteGetter";

@Injectable()
export class QuoteFacade {
  constructor(private creator: QuoteCreator, private getter: QuoteGetter) { }

  async createQuote(from: string, to: string, amount: number) {
    return await this.creator.run(from, to, amount);
  }

  async getQuote(id: string) {
    return this.getter.run(id);
  }
}