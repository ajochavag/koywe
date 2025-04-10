/**
 * QuoteProvider
 *
 * Proveedor externo de tasas de cambio. Este servicio se encarga de consultar la API de CryptoMarket (u otra definida)
 * para obtener la tasa de conversión entre dos monedas.
 *
 * ⚠️ Importante:
 *  - La API no exporta directamente `rate` por lo que se debe tomar el valor de `price` para interactuar.
 * 
 *  - La API externa utilizada invierte los parámetros `from` y `to`, por lo tanto, 
 *    para obtener la tasa correcta, los valores deben enviarse como `{ from: to, to: from }`.
 * 
 * Responsabilidades:
 * - Consultar una URL configurable (`CRYPTOMKT_API_URL`) para obtener la tasa de cambio.
 * - Manejar errores devolviendo una tasa por defecto en caso de fallo en la API externa.
 *
 * Notas:
 * - La const "getPrice" se usa dinamicamente para poder acceder al valor de divisa que se solicita.
 */
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

      const key = to;
      const getPrice = response?.data[key]?.price;
      
      if (getPrice === undefined || getPrice === null) {
        throw new Error(`No se pudo obtener el precio para la moneda: ${to}`);
      }

      return parseFloat(getPrice);
    } catch (err) {
      console.error("Hubo un error al consultar a la API");
      throw err;
    }
  }
}