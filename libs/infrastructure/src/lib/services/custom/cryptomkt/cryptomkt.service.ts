import { CryptomktService } from '@monorepo/core-domain-services';
import { HttpService } from '@nestjs/axios';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { CRYPTOMKT_CONSTANTS } from '../../../constants/cryptomkt.constants';
import { CryptomktResponse } from '../../../models/responses/cryptomkt.models';

export class CryptomktServiceImpl implements CryptomktService {
  constructor(private readonly httpService: HttpService) {}

  public async get(from: string, to: string): Promise<CryptomktResponse> {
    const url = `${CRYPTOMKT_CONSTANTS.BASE_URL}?from=${from}&to=${to}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));

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
