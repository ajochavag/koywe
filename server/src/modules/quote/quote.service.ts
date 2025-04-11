/**
 * QuoteService
 *
 * Servicio central del dominio de cotizaciones. Se encarga de orquestar y aplicar la lógica de negocio
 * relacionada con la gestión de cotizaciones, como la creación, consulta, validación o expiración de las mismas.
 *
 * Funciona como intermediario entre el controlador y las distintas capas de infraestructura.
 *
 * Responsabilidades (añade las nuevas responsabilidades):
 * - Crear nuevas cotizaciones basadas en tasas de cambio actualizadas.
 * - Validar la vigencia y consistencia de una cotización.
 * - Consultar o listar cotizaciones según criterios definidos.
 * - Aplicar reglas de negocio específicas sobre cotizaciones.
 *
 * Notas:
 * - La clase está anotada con `@Injectable()` para permitir su uso en el sistema de inyección de dependencias de NestJS.
 */

import { Injectable } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { QuoteBLL } from './quote.bll';
import { QuoteRepository } from './quote.repository';
import { QuoteProvider } from './quote.provider';

@Injectable()
export class QuoteService {
  constructor(
    private readonly bll: QuoteBLL,
    private readonly dal: QuoteRepository,
    private readonly provider: QuoteProvider,
  ) {}

  async createQuote(dto: QuoteDto) {
    const rate = await this.provider.getExchangeRate(dto.from, dto.to);
    const quote = this.bll.calculateQuote(dto, rate);
    await this.dal.createQuote(quote);
    return quote;
  }
}
