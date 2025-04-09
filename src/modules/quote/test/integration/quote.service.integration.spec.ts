/**
 * Pruebas unitarias para `QuoteService`, encargado de la lógica orquestadora
 *
 * El servicio coordina tres componentes clave:
 * - `QuoteProvider`: Proveedor externo de tasas de cambio.
 * - `QuoteBLL`: Lógica de negocio para cálculo de cotizaciones.
 * - `QuoteRepository`: Persistencia de datos en base de datos.
 *
 *  En este archivo se valida principalmente:
 * - El flujo completo de creación de una cotización (`createQuote`), asegurando
 *   que cada dependencia sea invocada correctamente y el resultado final sea consistente.
 *
 *  Consideraciones futuras:
 * - Este archivo crecerá conforme se agreguen nuevas funcionalidades al servicio (`QuoteService`),
 *   por ejemplo: validaciones adicionales, lógica de cancelación, obtención por ID, etc.
 * - Mantener coherencia en los mocks y en la validación de flujos para cada nueva función.
 *
 */

import { QuoteService } from '../../quote.service';
import { QuoteProvider } from '../../quote.provider';
import { QuoteBLL } from '../../quote.bll';
import { QuoteRepository } from '../../quote.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteDto } from '../../dto/quote.dto';

describe('QuoteService', () => {
  let service: QuoteService;
  let provider: QuoteProvider;
  let bll: QuoteBLL;
  let repository: QuoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: QuoteProvider,
          useValue: { getExchangeRate: jest.fn() },
        },
        {
          provide: QuoteBLL,
          useValue: { calculateQuote: jest.fn() },
        },
        {
          provide: QuoteRepository,
          useValue: { createQuote: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    provider = module.get<QuoteProvider>(QuoteProvider);
    bll = module.get<QuoteBLL>(QuoteBLL);
    repository = module.get<QuoteRepository>(QuoteRepository);
  });

  it('debería crear una cotización correctamente', async () => {
    const dto: QuoteDto = { amount: 1000, from: 'ARS', to: 'ETH' };
    const rate = 0.0000023;
    const generatedQuote = {
        ...dto,
        rate,
        id: 'abc',
        convertedAmount: 0.0023,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };

    (provider.getExchangeRate as jest.Mock).mockResolvedValue(rate);
    (bll.calculateQuote as jest.Mock).mockReturnValue(generatedQuote);
    (repository.createQuote as jest.Mock).mockResolvedValue(generatedQuote);

    const result = await service.createQuote(dto);

    expect(provider.getExchangeRate).toHaveBeenCalledWith(dto.from, dto.to);
    expect(bll.calculateQuote).toHaveBeenCalledWith(dto, rate);
    expect(repository.createQuote).toHaveBeenCalledWith(generatedQuote);
    expect(result).toEqual(generatedQuote);
  });
});
