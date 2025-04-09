/**
 * QuoteProvider
 *
 * Proveedor externo de tasas de cambio. Este servicio se encarga de consultar la API de CryptoMarket (u otra definida)
 * para obtener la tasa de conversión entre dos monedas.
 *
 * ⚠️ Importante:
 * La API externa utilizada invierte los parámetros `from` y `to`, por lo tanto, 
 * para obtener la tasa correcta, los valores deben enviarse como `{ from: to, to: from }`.
 *
 * Responsabilidades:
 * - Consultar una URL configurable (`CRYPTOMKT_API_URL`) para obtener la tasa de cambio.
 * - Manejar errores devolviendo una tasa por defecto en caso de fallo en la API externa.
 *
 * Notas:
 * - Utiliza el servicio `ConfigService` de NestJS para obtener la URL base desde las variables de entorno.
 * - La tasa por defecto (0.0000023) puede ser ajustada según criterios del negocio en caso de error.
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

      return response.data?.rate || 1;
    } catch (err) {
      return 0.0000023; 
    }
  }
}