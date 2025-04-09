/**
 * La API utiliza los parametros invertidos, 
 * para su correcto funcionamiento deberias setearlo asi: {from: to, to: from}
 * **/
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QuoteDAL {
  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const response = await axios.get(`https://api.exchange.cryptomkt.com/api/3/public/price/rate`, {
        params: { from: to, to: from } 
      });

      return response.data?.rate || 1;
    } catch (err) {
      return 0.0000023; 
    }
  }
}
