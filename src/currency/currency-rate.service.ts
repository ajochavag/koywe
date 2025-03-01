import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CurrencyRateService {
    async getExchangeRate(from: string, to: string): Promise<number> {
        const url = `https://api.exchange.cryptomkt.com/api/3/public/price/rate?from=${to}&to=${from}`;

        try {
            const response = await axios.get(url);
            const rate = response.data.rate;

            if (!rate) {
                throw new HttpException('Tipo de cambio no disponible', HttpStatus.NOT_FOUND);
            }

            return rate;
        } catch (error) {
            console.log('Error al obtener el tipo de cambio:', error);
            throw new HttpException('Error al obtener el tipo de cambio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}