import { InjectModel } from "@nestjs/mongoose";
import { Quote } from "../../domain/class/Quote";
import { QuotePersistRepository } from "../../domain/contracts/QuotePersistRepository";
import { Model } from "mongoose";
import { QuoteModel } from "./models/QuoteModel";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class QuotePersistMongoRepository implements QuotePersistRepository {
  constructor(
    @InjectModel('quotes') private quoteModel: Model<QuoteModel>
  ) { }
  async searchById(id: string): Promise<Quote> {
    const quote = await this.quoteModel.findOne({ id }).lean();
    if (!quote || quote?.expiresAt <= new Date()) throw new NotFoundException(`Quote ${id} not found`);

    return new Quote(
      quote.id,
      quote.from,
      quote.to,
      quote.amount,
      quote.rate,
      quote.convertedAmount,
      quote.timestamp.toISOString(),
      quote.expiresAt.toISOString(),
    );
  }

  async save(from: string, to: string, amount: number, rate: number, convertedAmount: number): Promise<Quote> {
    const quote = await new this.quoteModel({ from, to, amount, rate, convertedAmount }).save();
    return new Quote(
      quote.id,
      quote.from,
      quote.to,
      quote.amount,
      quote.rate,
      quote.convertedAmount,
      quote.timestamp.toISOString(),
      quote.expiresAt.toISOString()
    );
  }
}