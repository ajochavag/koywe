/**
 * Pruebas unitarias para el controlador `AuthController`.
 *
 * Objetivo:
 * - Verificar que el controlador `AuthController` se comporta correctamente al recibir solicitudes para crear un nuevo usuario (`signup`) y para iniciar sesión (`signin`).
 *
 * Dependencias Mockeadas:
 * - `AuthService`: Se mockean las funciones `signup` y `signin` para simular el comportamiento real del servicio y evitar la interacción real con la base de datos o con servicios externos.
 *
 * NOTAS:
 * - Pruebas unitarias: Las pruebas están diseñadas para garantizar que el controlador invoca correctamente los métodos del servicio `AuthService` y maneja las respuestas de manera adecuada.
 * - Mock de `AuthService`: Se utiliza un mock para reemplazar el servicio real, asegurando que se pueda controlar el comportamiento de las funciones y simular diferentes respuestas.
 * - Estructura de los `DTO`: Los objetos `dto` se usan para simular las entradas esperadas para las operaciones de registro y autenticación.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      signin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('debería llamar a authService.signup y retornar su resultado', async () => {
      const dto = { email: 'mail@mail.com', password: '123456', username: 'user' };
      const mockResponse = { message: 'Se creo el usuario exitosamente', user: { id: 1, ...dto } };

      authService.signup!.mockResolvedValue(mockResponse);

      const result = await authController.signup(dto);

      expect(authService.signup).toHaveBeenCalledWith(dto.email, dto.password, dto.username);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signin', () => {
    it('debería llamar a authService.signin y retornar su resultado', async () => {
      const dto = { username: 'user', password: '123456' };
      const mockToken = { access_token: 'mocked-token' };

      authService.signin!.mockResolvedValue(mockToken);

      const result = await authController.signin(dto);

      expect(authService.signin).toHaveBeenCalledWith(dto.username, dto.password);
      expect(result).toEqual(mockToken);
    });
  });
});
