import axios from 'axios';
import {
  GetRateResponse,
  ExchangeRateProvider,
} from '../../../application/repository/exchange-rate.provider.interface';

export class CryptomktProvider implements ExchangeRateProvider {
  async getRate(from: string, to: string): Promise<GetRateResponse> {
    const { data } = await axios.get<GetRateResponse>(
      `${process.env.CRYPTOMKT_URL}/price/rate?from=${from}&to=${to}`,
    );

    return data;
  }
}
