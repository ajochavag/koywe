import { Injectable } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class CurrencyService {
    getQuoteById(id: string) {
        throw new Error('Method not implemented.');
    }
    constructor(private readonly currencyRateService: CurrencyRateService) {}

    async convertToCrypto(amount: number, currency: string, crypto: string): Promise<number> {
        const exchangeRate = await this.currencyRateService.getExchangeRate(currency, crypto);
        return amount * exchangeRate;
    }

    async convertToFiat(amount: number, crypto: string, currency: string): Promise<number> {
        const exchangeRate = await this.currencyRateService.getExchangeRate(crypto, currency);
        return amount * exchangeRate;
    }

    async createQuote(amount: number, from: string, to: string): Promise<{ id: string; amount: number; from: string; to: string; createdAt: Date; expiresAt: Date }> {
        const exchangeRate = await this.currencyRateService.getExchangeRate(from, to);
        const convertedAmount = amount * exchangeRate;

        const id = uuidv4();
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);

        return {
            id,
            amount: convertedAmount,
            from,
            to,
            createdAt,
            expiresAt,
        };
    }
}
