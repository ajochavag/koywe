/**
** Pruebas unitarias para la capa de acceso a datos de la DB y de API.
* Se utiliza axios-mock-adapter para simular el comportamiento de la API.
* Patrón de test AAA (Arrange, Act, Assert/ Preparar, Actuar, Verificar).
* 
* Estas pruebas validan:
* - La obtención de la tasa de cambio desde una API externa (quoteRepository).
*/

import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRepository } from '../../quote.repository';
import { QuoteProvider } from '../../quote.provider';
import { PrismaDAL } from '../../../prisma/prisma.dal';
import { ConfigService } from '@nestjs/config'; 
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('QuoteRepository', () => {
  let quoteRepository: QuoteRepository;
  let mock: MockAdapter;
  let quoteProvider: QuoteProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        QuoteProvider,
        ConfigService,
        {
          provide: PrismaDAL,
          useValue: {},
        },
      ],
    }).compile();
  
    quoteRepository = module.get<QuoteRepository>(QuoteRepository);
    quoteProvider = module.get<QuoteProvider>(QuoteProvider);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore(); // Limpiar mocks después de cada prueba
  });

  it('debería obtener la tasa de cambio desde la API externa', async () => {
    // Arrange
    const from = 'ARS';
    const to = 'ETH';
    const rate = 0.0000023;

    mock.onGet(`https://api.exchange.cryptomkt.com/api/3/public/price/rate`, {
      params: { from: to, to: from },
    }).reply(200, { rate });

    // Act
    const result = await quoteProvider.getExchangeRate(from, to);

    // Assert
    expect(result).toBe(rate);
  });

  it('debería manejar errores y devolver una tasa por defecto', async () => {
    // Arrange
    const from = 'ARS';
    const to = 'ETH';

    mock.onGet(`https://api.exchange.cryptomkt.com/api/3/public/price/rate`, {
      params: { from: to, to: from },
    }).networkError();

    // Act
    const result = await quoteProvider.getExchangeRate(from, to);

    // Assert
    expect(result).toBe(0.0000023); // Valor por defecto en caso de error
  });
});