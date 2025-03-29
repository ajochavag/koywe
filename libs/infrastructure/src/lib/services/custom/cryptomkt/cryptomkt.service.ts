import { HttpService } from '@nestjs/axios';
import { plainToInstance } from 'class-transformer';
import { CryptomktResponse } from '../../../models/responses/cryptomkt.models';

export class CryptomktService {
  constructor() {
    /**/
  }

  public async get(from: string, to: string) {
    // FIXME: Change this to constant and create a configService
    const url = `https://api.exchange.cryptomkt.com/api/3/public/price/rate?from=${from}&to=${to}`;

    try {
      const http = new HttpService();
      const response = await http.get(url).toPromise();

      const data = response?.data;
      const key = Object.keys(data)[0];
      const extractedData = data[key];

      return plainToInstance(CryptomktResponse, extractedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
