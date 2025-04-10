/**
 * Pruebas unitarias para la estrategia `JwtStrategy`.
 *
 * Objetivo:
 * Verificar que la estrategia de validación del JWT (`JwtStrategy`) maneja correctamente la validación del token y la respuesta correspondiente según el payload.
 *
 */

import { JwtStrategy } from '../../strategies/jwt-token.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('debería retornar el payload cuando el token es válido', async () => {
      const payload = { sub: '1', email: 'user@test.com' };
      
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual(payload); // La validación debería devolver el payload directamente.
    });

    it('debería lanzar UnauthorizedException si el payload es incorrecto', async () => {
      const payload = null;

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});