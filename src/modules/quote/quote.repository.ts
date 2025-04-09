/**
 * Esta clase proporciona métodos para interactuar con el modelo `quote` en la base de datos,
 * utilizando Prisma como ORM. Permite obtener una cotización por ID y crear nuevas cotizaciones.
 *
 * Principales funcionalidades:
 * - getQuoteById(id): Retorna una cotización si existe y no ha expirado. Lanza una excepción si no existe o si ha expirado.
 * - createQuote(quoteData): Crea una nueva cotización en la base de datos.
 *
 * Notas:
 * - Usa el decorador `@Injectable()` para ser inyectado como dependencia dentro del ecosistema de NestJS.
 * - Usa una definición de tipo `Quote` para tipado seguro basado en el resultado de `prisma.quote.findFirst`.
 */
import { Injectable, NotFoundException  } from '@nestjs/common';
import { PrismaDAL } from '../prisma/prisma.dal'
import { PrismaClient } from '@prisma/client';
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
