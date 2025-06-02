import { Quote } from "../class/Quote";

export interface QuotePersistRepository {
  searchById(id: string): Promise<Quote>;
  save(from: string, to: string, amount: number, rate: number, convertedAmount: number): Promise<Quote>;
}
