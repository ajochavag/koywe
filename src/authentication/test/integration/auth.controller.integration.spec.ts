import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
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
