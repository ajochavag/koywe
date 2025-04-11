/**
 * Pruebas de integración de `QuoteController`.
 *
 * Estas pruebas validan el flujo completo entre el controlador y las capas de negocio (BLL) y persistencia (DAL),
 * asegurando que la aplicación se comporte correctamente ante solicitudes reales HTTP.
 *
 *  Qué se está validando actualmente:
 * - El endpoint `POST /quote` retorna una cotización válida cuando se le envía un cuerpo de solicitud correcto.
 *
 *  Estructura de pruebas:
 * - Se utiliza `supertest` para simular peticiones HTTP reales contra la aplicación NestJS en ejecución.
 * - El módulo `QuoteModule` es cargado como dependencia, incluyendo todas sus capas internas.
 * - Se mockea el `JwtAuthGuard` mediante `.overrideGuard()` para evitar la necesidad de autenticación real.
 *
 *  Consideraciones futuras:
 * - Este archivo debe ampliarse para incluir más pruebas de integración a medida que crezcan los endpoints,
 * - Se recomienda mantener una separación clara entre pruebas unitarias (capa a capa) y pruebas de integración (flujo completo).
 *  
 *  NOTAS:
 * - Aunque estamos reemplazando el JwtAuthGuard con un mock (para evitar la lógica de autenticación)
 *  NestJS igualmente necesita registrar la estrategia jwt de passport, que no la registra el guardia, sino el AuthModule.
 * - La línea `// eslint-disable-next-line @typescript-eslint/no-unused-vars` es necesaria para desactivar temporalmente
 *   la regla `@typescript-eslint/no-unused-vars`, ya que el parámetro `context` en el método `canActivate` no es utilizado
 *   en esta implementación de prueba. Esta desactivación se hace para evitar que ESLint arroje un error innecesario
 *   por un parámetro no utilizado. Este comportamiento es esperado en este caso ya que el propósito del mock es
 *   simular una autenticación sin lógica real. 
*/


import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { QuoteModule } from '../../quote.module';
import { JwtAuthGuard } from '../../../../authentication/guard/jwt-auth.guard'; 
import { AuthModule } from '../../../../authentication/auth.module';


class MockAuthGuard implements CanActivate {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true; // Siempre permite el acceso
  }
}

describe('QuoteController (integración)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [QuoteModule, AuthModule],
    })
    .overrideGuard(JwtAuthGuard)// Se reemplaza el JwtAuthGuard para que no requiera autenticación real durante las pruebas
    .useClass(MockAuthGuard)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería retornar una cotización válida desde el endpoint', async () => {
    const dto = {
      amount: 1000,
      from: 'ARS',
      to: 'ETH',
    };

    const response = await request(app.getHttpServer())
      .post('/quote')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('rate');
    expect(response.body.amount).toBe(dto.amount);
    expect(response.body.from).toBe(dto.from);
    expect(response.body.to).toBe(dto.to);
    expect(response.body.convertedAmount).toBeGreaterThan(0);
  });
});
