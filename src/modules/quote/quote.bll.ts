/**
 * QuoteBLL
 *
 * Esta clase encapsula la lógica de negocio para el cálculo de cotizaciones entre monedas.
 *
 * ---
 * Responsabilidades principales:
 *
 * 1. Obtener el precio de la moneda destino desde un proveedor externo (el provider no entrega el rate directamente).
 *    - El `priceProvider` recibido representa el precio de 1 unidad de la moneda destino (`to`) en términos de la moneda origen (`from`).
 *    - Por ejemplo, si `from = ARS` y `to = USDT`, y el provider devuelve `priceProvider = 1372.17`,
 *      esto significa que 1 USDT cuesta 1372.17 ARS.
 *    - Para obtener el `rate` (tasa de conversión de `from` a `to`), se invierte el valor: `rate = 1 / priceProvider`.
 *
 * 2. Calcular la cotización:
 *    - Se utiliza la librería `decimal.js` para realizar los cálculos con precisión financiera, evitando errores de redondeo.
 *    - Se calcula el monto convertido (`convertedAmount = amount * rate`), redondeado a 7 decimales.
 *
 * 3. Establecer metadatos de la cotización:
 *    - Se genera un `id` único (UUID) para cada cotización.
 *    - Se establece una fecha de expiración (`expiresAt`), 20 segundos después de la creación, para evitar el uso de tasas desactualizadas.
 *
 * ---
 * Consideraciones técnicas:
 *
 * - `Decimal.js` garantiza exactitud en los cálculos financieros, especialmente cuando se trabaja con tasas muy pequeñas o montos grandes.
 * - Este método no interactúa directamente con APIs externas. Se asume que el valor de `priceProvider` ya fue obtenido y validado.
 *
 * ---
 * Parámetros:
 * @param dto - Objeto con los datos de la cotización (from, to, amount)
 * @param priceProvider - Precio unitario de la moneda destino, expresado en términos de la moneda origen.
 *
 */

import { Injectable } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import { Decimal } from 'decimal.js';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuoteBLL {
  calculateQuote(dto: QuoteDto, priceProvider: number) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 20 * 1000); // 20segundos

    const amount = new Decimal(dto.amount);
    const price = new Decimal(priceProvider);

    // Invertir el precio para obtener cuántas unidades de 'to' se obtienen por 1 unidad de 'from'
    const rate = new Decimal(1).div(price);

    const convertedAmount = amount.mul(rate).toDecimalPlaces(7);

    return {
      id: uuid(),
      from: dto.from,
      to: dto.to,
      amount: amount.toNumber(),
      rate: rate.toNumber(),
      convertedAmount: convertedAmount.toNumber(),
      timestamp: now,
      expiresAt: expiresAt,
    };
  }
}
