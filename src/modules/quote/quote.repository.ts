/**
 * Esta clase proporciona métodos para interactuar con el modelo `quote` en la base de datos,
 * utilizando Prisma como ORM. Permite obtener una cotización por ID y crear nuevas cotizaciones.
 *
 * Principales funcionalidades:
 * - getQuoteById(id): Retorna una cotización si existe y no ha expirado. Lanza una excepción si no existe o si ha expirado.
 * - createQuote(quoteData): Crea una nueva cotización en la base de datos.
 *
 * NOTAS:
 * - Usa el decorador `@Injectable()` para ser inyectado como dependencia dentro del ecosistema de NestJS.
 * - Usa una definición de tipo `Quote` para tipado seguro basado en el resultado de `prisma.quote.findFirst`.
 * La línea `// eslint-disable-next-line @typescript-eslint/no-unused-vars` se utiliza para desactivar temporalmente
 * la regla `@typescript-eslint/no-unused-vars`, ya que la constante `prisma` es declarada pero no se utiliza en el código. 
 * Esta desactivación es necesaria para evitar que ESLint arroje un error innecesario debido a la variable no utilizada,
 * ya que la constante es utilizada solo para definir el tipo `Users`. 
 * Esta situación es esperada en este caso porque el archivo está utilizando `prisma` para definir el tipo y no se espera
 * una instancia activa del cliente Prisma en este archivo.
 */
import { Injectable, NotFoundException  } from '@nestjs/common';
import { PrismaDAL } from '../prisma/prisma.dal'
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
export type Quote = Awaited<ReturnType<typeof prisma.quote.findFirst>>;

@Injectable()
export class QuoteRepository {
  constructor(private readonly prisma: PrismaDAL) {}
  
  async getQuoteById(id: string): Promise<Quote> {
    const quote = await this.prisma.quote.findUnique({ where: { id } });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    if (new Date() > quote.expiresAt) {
      throw new NotFoundException('La cotización ha expirado');
    }

    return quote;
  }

  async createQuote(quoteData: Quote) {
    return this.prisma.quote.create({
      data: quoteData,
    });
  }

}
