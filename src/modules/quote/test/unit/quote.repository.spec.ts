/**
 * Pruebas unitarias para la capa de acceso a datos (QuoteRepository) que interactúa con Prisma.
 *
 * Estas pruebas validan el comportamiento esperado de las funciones `getQuoteById` y `createQuote`,
 * encargadas de consultar y almacenar cotizaciones en la base de datos.
 *
 * Funcionalidades testeadas:
 * - `getQuoteById`:
 *    - Devuelve una cotización válida si existe y no ha expirado.
 *    - Lanza `NotFoundException` si no se encuentra la cotización.
 *    - Lanza excepción si la cotización ha expirado.
 *
 * - `createQuote`:
 *    - Crea correctamente una cotización utilizando Prisma.
 *
 * Consideraciones:
 * - Se utiliza `jest.fn()` para simular el comportamiento del cliente Prisma (`PrismaDAL`).
 * - Se evita el acceso real a la base de datos mediante inyección de dependencias mockeadas.
 * - Las pruebas son atómicas y limpian los mocks tras cada ejecución (`jest.clearAllMocks`).
 * 
 *  NOTAS:
 * - La línea `// eslint-disable-next-line @typescript-eslint/no-unused-vars` desactiva la regla
 *  `@typescript-eslint/no-unused-vars` debido a que la variable `prismaDAL` no se utiliza directamente
 *  en las pruebas, pero es parte de la configuración para inyectar el mock del cliente Prisma.
 *  Esta desactivación se hace para evitar una advertencia innecesaria de ESLint sobre una
 *  variable no utilizada, que en este caso no afecta al propósito de las pruebas.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRepository } from '../../quote.repository';
import { PrismaDAL } from '../../../prisma/prisma.dal';
import { NotFoundException } from '@nestjs/common';

describe('QuoteRepository.getQuoteById', () => {
  let repository: QuoteRepository;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaDAL: PrismaDAL;

  const mockPrismaDAL = {
    quote: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        {
          provide: PrismaDAL,
          useValue: mockPrismaDAL,
        },
      ],
    }).compile();

    repository = module.get<QuoteRepository>(QuoteRepository);
    prismaDAL = module.get<PrismaDAL>(PrismaDAL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver la cotización si existe y no ha expirado', async () => {
    const futureDate = new Date(Date.now() + 60000);
    const mockQuote = { id: '1', expiresAt: futureDate };

    mockPrismaDAL.quote.findUnique.mockResolvedValue(mockQuote);

    const result = await repository.getQuoteById('1');
    expect(result).toEqual(mockQuote);
  });

  it('debería lanzar excepción si no encuentra la cotización', async () => {
    mockPrismaDAL.quote.findUnique.mockResolvedValue(null);

    await expect(repository.getQuoteById('1')).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar excepción si la cotización ha expirado', async () => {
    const pastDate = new Date(Date.now() - 60000);
    const expiredQuote = { id: '1', expiresAt: pastDate };

    mockPrismaDAL.quote.findUnique.mockResolvedValue(expiredQuote);

    await expect(repository.getQuoteById('1')).rejects.toThrow('La cotización ha expirado');
  });

  it('debería crear una cotización en la base de datos', async () => {
    const mockQuote = {
      id: '123',
      from: 'ARS',
      to: 'ETH',
      amount: 1000,
      rate: 0.0000023,
      convertedAmount: 0.0023,
      timestamp: new Date(),
      expiresAt: new Date(),
    };

    mockPrismaDAL.quote.create.mockResolvedValue(mockQuote);

    const result = await repository.createQuote(mockQuote);
    expect(result).toEqual(mockQuote);
  });
});
