/**
 * Este archivo contiene las pruebas de integración para el controlador AuthController.
 *
 * En estas pruebas, se utiliza el patrón de inyección de dependencias de NestJS para
 * garantizar que el controlador y el servicio AuthService estén correctamente integrados.
 * Aunque el servicio AuthService está mockeado, su inyección sigue siendo esencial
 * para simular el comportamiento real del sistema y verificar las interacciones correctas
 * entre el controlador y el servicio.
 *
 * Mantener la inyección del servicio mockeado asegura que las pruebas reflejen de manera
 * adecuada cómo interactúan estos componentes en un entorno de producción.
 *
 * NOTAS:
 * - No eliminar la línea de inyección de `userService`**, ya que es fundamental para la validez y cobertura
 *   de las pruebas unitarias.
 * - La línea de `eslint-disable-next-line @typescript-eslint/no-unused-vars` indica que esto no es un error
 *   y es un patrón común en las pruebas unitarias cuando la variable no es utilizada directamente, pero su
 *   presencia asegura que las dependencias están correctamente definidas.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Limpiar mocks después de cada prueba
  });

  // Prueba de la ruta `signup`
  describe('signup', () => {
    it('debería llamar a authService.signup y devolver un mensaje de éxito', async () => {
      // Datos de prueba
      const dto = { email: 'test@test.com', password: 'password123', username: 'testuser' };
      
      // Simulamos la respuesta de authService.signup
      mockAuthService.signup.mockResolvedValue({
        message: 'Usuario creado con éxito',
        user: dto,
      });

      // Ejecutamos el método del controller
      const result = await authController.signup(dto);

      // Verificamos que el servicio `signup` haya sido llamado correctamente
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto.email, dto.password, dto.username);

      // Comprobamos que el resultado es el esperado
      expect(result).toEqual({
        message: 'Usuario creado con éxito',
        user: dto,
      });
    });
  });

  // Prueba de la ruta `signin`
  describe('signin', () => {
    it('debería llamar a authService.signin y devolver el token', async () => {
      // Datos de prueba
      const dto = { username: 'testuser', password: 'password123' };

      // Simulamos la respuesta de authService.signin
      mockAuthService.signin.mockResolvedValue({ access_token: 'mockedToken' });

      // Ejecutamos el método del controller
      const result = await authController.signin(dto);

      // Verificamos que el servicio `signin` haya sido llamado correctamente
      expect(mockAuthService.signin).toHaveBeenCalledWith(dto.username, dto.password);

      // Comprobamos que el resultado es el esperado
      expect(result).toEqual({ access_token: 'mockedToken' });
    });

    it('debería lanzar UnauthorizedException si las credenciales son incorrectas', async () => {
      // Datos de prueba
      const dto = { username: 'testuser', password: 'wrongpassword' };

      // Simulamos que authService.signin lanza UnauthorizedException
      mockAuthService.signin.mockRejectedValue(new UnauthorizedException());

      // Ejecutamos el método del controller y verificamos que se lanza la excepción
      await expect(authController.signin(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
