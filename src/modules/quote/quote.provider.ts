/**
 * La API utiliza los parametros invertidos, 
 * para su correcto funcionamiento deberias setearlo asi: {from: to, to: from}
 * **/
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuoteProvider {
    constructor(private readonly configService: ConfigService) {}

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const baseUrl = this.configService.get<string>('CRYPTOMKT_API_URL');
      const response = await axios.get(`${baseUrl}/public/price/rate`, {
        params: { from: to, to: from } 
      });

      return response.data?.rate || 1;
    } catch (err) {
      return 0.0000023; 
    }
  }
}