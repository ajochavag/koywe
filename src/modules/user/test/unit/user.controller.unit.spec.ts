/**
 * Pruebas unitarias para el controlador `UserController`.
 *
 * Estrategia:
 * - Se mockea el guard `JwtAuthGuard` para evitar el proceso real de autenticación y permitir acceso simulado.
 * - Se simula un objeto `Request` con la propiedad `user` que normalmente es inyectada por el guard de autenticación.
 *
 * Funcionalidades:
 * - `getProfile`: Retorna correctamente el objeto `user` desde la petición autenticada.
 *
 * Notas:
 * - Estas pruebas no testean seguridad real ni validación de JWT, solo el comportamiento del controlador en un entorno autenticado simulado.
 * - Útil para verificar respuesta esperada bajo condiciones controladas de autenticación.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { JwtAuthGuard } from '../../../../authentication/guard/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Mock del JwtAuthGuard que simplemente permite el acceso
class MockJwtAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, email: 'test@example.com', username: 'testuser' };
    return true;
  }
}

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [Reflector],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('debería retornar el perfil del usuario autenticado', async () => {
    const mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    const result = await controller.getProfile(mockRequest);
    expect(result).toEqual(mockRequest.user);
  });
});
