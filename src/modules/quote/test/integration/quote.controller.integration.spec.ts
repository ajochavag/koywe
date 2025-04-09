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
 *
 *  Consideraciones futuras:
 * - Este archivo debe ampliarse para incluir más pruebas de integración a medida que crezcan los endpoints,
 * - Se recomienda mantener una separación clara entre pruebas unitarias (capa a capa) y pruebas de integración (flujo completo).
 *
 */


import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { QuoteModule } from '../../quote.module';

describe('QuoteController (integración)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [QuoteModule],
    }).compile();

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
