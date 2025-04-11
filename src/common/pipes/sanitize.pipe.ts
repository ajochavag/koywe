/**
 * SanitizePipe
 * 
 * Este Pipe se encarga de sanitizar todas las entradas del usuario en los controladores
 * para prevenir ataques XSS (Cross-Site Scripting) limpiando etiquetas HTML maliciosas.
 * 
 * - Utiliza la librería `sanitize-html` para limpiar strings.
 * - Si el input es un objeto, recorre todas sus propiedades de forma recursiva
 *   y limpia cada valor string encontrado.
 * - Si el input es un string simple, lo sanitiza directamente.
 * - Para otros tipos de datos, devuelve el valor tal cual.
 * 
 * Este pipe puede ser aplicado globalmente o de forma individual a rutas que
 * reciban datos potencialmente peligrosos desde `body`, `query` o `params`.
 * 
 * Ejemplo de uso:
 *   @UsePipes(new SanitizePipe())
 *   app.useGlobalPipes(new SanitizePipe());
 * 
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {

  transform(value: any, _metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      // Sanitiza un string simple
      return sanitizeHtml(value);
    }

    if (typeof value === 'object' && value !== null) {
      // Sanitiza un objeto recorriendo cada propiedad
      return this.sanitizeObject(value);
    }

    // Devuelve tal cual si no es string ni objeto (ej: números, booleanos)
    return value;
  }

  private sanitizeObject(obj: any): any {
    const sanitized: any = {};

    for (const key in obj) {
      const val = obj[key];
      
      sanitized[key] =
        typeof val === 'string'
          ? sanitizeHtml(val) // Sanitiza strings individuales
          : typeof val === 'object' && val !== null
          ? this.sanitizeObject(val) // Llama recursivamente si es un objeto anidado
          : val; // Deja valores no string ni objeto sin modificar
    }

    return sanitized;
  }
}