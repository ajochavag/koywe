import { randomBytes } from 'crypto';
import { Schema, Document } from 'mongoose';
import config from 'src/app/config';

export interface QuoteModel extends Document {
  id: string;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: Date;
  expiresAt: Date;
}

export const QuoteSchema = new Schema(
  {
    id: {
      type: String,
      default: () => randomBytes(8).toString('hex'),
      unique: true,
      index: true,
    },
    from: String,
    to: String,
    amount: Number,
    rate: Number,
    convertedAmount: Number,
    timestamp: {
      type: Date,
      default: () => new Date(),
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + Number(config.QUOTE.TTL) * 1000),
      expires: config.QUOTE.TTL,
    },
  },
  {
    versionKey: false,
  }
);
