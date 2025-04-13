/**
 * ApiServices
 *
 * Este serevicio se encarga de consultar las divisas disponibles y retorna el la lista alfabeticamente ordenadas.
 * 
 * Responsabilidades:
 * - Consultar a la API las divisa disponibles para los intercambios
 * - Recuperar solo las keys sin información adicional
 * - Ordenar la lista de las keys alfabeticamente
 */
import { Injectable} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios'

@Injectable()
export class ApiService {
  constructor(private readonly configService: ConfigService) {}

  async getCurrencies() {
    try {
      const baseUrl = this.configService.get<string>('CRYPTOMKT_API_URL');
      const response = await axios.get(`${baseUrl}/public/currency`)
      const data = response.data
      const list = Object.keys(data)
      const currencies = list.sort((a, b) => a.localeCompare(b));
      return currencies
    } catch (error) {
      throw new HttpException('Error al obtener las divisas', HttpStatus.BAD_GATEWAY);
    }
  }
}
