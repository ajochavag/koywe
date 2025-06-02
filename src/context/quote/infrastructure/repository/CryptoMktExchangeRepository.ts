import { Injectable, BadRequestException, Logger, ConflictException } from '@nestjs/common';
import { ExchangeRateRepository } from '../../domain/contracts/ExchangeRateRepository';
import axios from 'axios';
import config from '../config';
import { CryptoMktExchangeResponse } from './CryptoMktExchangeResponse';


@Injectable()
export class CryptoMktExchangeRepository implements ExchangeRateRepository {

  async getRate(from: string, to: string): Promise<number> {
    try {
      const response = await axios.get<CryptoMktExchangeResponse>(config.CRYPTO_MKT_PRICE_RATE_URL(from, to));
      const rate = response?.data?.[from]?.price;
      if (!rate) throw new ConflictException('Invalid response');
      return parseFloat(rate);
    } catch (err) {
      throw new BadRequestException(`Exchange rate not available for ${from} to ${to}`);
    }
  }
}
