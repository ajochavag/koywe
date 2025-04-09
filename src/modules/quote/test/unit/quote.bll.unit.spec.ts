  /**
   * Pruebas unitarias para la capa de lógica de negocios (BLL) y de acceso a datos (DAL)
   * Patrón de test AAA (Arrange, Act, Assert/ Preparar, Actuar, Verificar)
   * relacionadas con cotizaciones de moneda.
   *
   * Estas pruebas validan:
   * - El cálculo correcto de una cotización (QuoteBLL).
   */

  import { Test, TestingModule } from '@nestjs/testing';
  import { QuoteBLL } from '../../quote.bll';
  import { QuoteDto } from '../../dto/quote.dto';
  
  jest.mock('uuid');
  
  describe('QuoteBLL', () => {
    let quoteBLL: QuoteBLL;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [QuoteBLL],
      }).compile();
  
      quoteBLL = module.get<QuoteBLL>(QuoteBLL);
    });
  
    it('debería calcular correctamente una cotización', () => {
      // Arrange: Preparamos los datos de entrada
      const dto: QuoteDto = { amount: 1000, from: 'ARS', to: 'ETH' };
      const rate = 0.0000023;
  
      // Act: Ejecutamos el método que queremos probar
      const result = quoteBLL.calculateQuote(dto, rate);
  
      // Assert: Verificamos que el resultado sea correcto
      expect(result).toHaveProperty('id');
      expect(result.amount).toBe(dto.amount);
      expect(result.from).toBe(dto.from);
      expect(result.to).toBe(dto.to);
      expect(result.rate).toBe(rate);
      expect(result.convertedAmount).toBeCloseTo(dto.amount * rate, 6);
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(new Date(result.timestamp).getTime());
    });
  });