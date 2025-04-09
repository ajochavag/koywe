/**
 * Pruebas unitarias de la lógica de negocio para cotizaciones (QuoteBLL).
 *
 * Este archivo se enfoca en testear el cálculo de cotizaciones mediante la clase `QuoteBLL`,
 * asegurando que la lógica de conversión entre monedas funcione correctamente.
 *
 * Patrón utilizado: AAA (Arrange, Act, Assert / Preparar, Actuar, Verificar)
 *
 * Objetivos de estas pruebas:
 * - Validar que la función `calculateQuote`:
 *   - Genere correctamente todos los campos esperados.
 *   - Calcule correctamente el monto convertido (`convertedAmount`).
 *   - Asigne una fecha de expiración posterior al timestamp de creación.
 *
 * Consideraciones:
 * - Se usa Jest como framework de pruebas.
 * - Se mockea el paquete `uuid` para evitar resultados aleatorios en los IDs durante las pruebas.
 * - Las pruebas se enfocan en la lógica pura, sin dependencias externas ni conexión a bases de datos.
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
      // Arrange
      const dto: QuoteDto = { amount: 1000, from: 'ARS', to: 'ETH' };
      const rate = 0.0000023;
  
      // Act
      const result = quoteBLL.calculateQuote(dto, rate);
  
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.amount).toBe(dto.amount);
      expect(result.from).toBe(dto.from);
      expect(result.to).toBe(dto.to);
      expect(result.rate).toBe(rate);
      expect(result.convertedAmount).toBeCloseTo(dto.amount * rate, 6);
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(new Date(result.timestamp).getTime());
    });
  });