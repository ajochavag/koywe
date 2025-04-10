/**
 * Pruebas unitarias para el servicio `AuthService`.
 *
 * Objetivo:
 * Verificar las funcionalidades de inicio de sesión (`signin`) y registro (`signup`) del servicio de autenticación.
 * Estas pruebas aseguran que el flujo de autenticación, desde la verificación del usuario hasta la generación del token JWT, funcione correctamente.
 *
 * Dependencias Mockeadas:
 * - `bcrypt`: Se mockean las funciones `hash` y `compare` para simular el comportamiento real de encriptación y verificación de contraseñas.
 * - `UserService`: Se mockean las funciones `findByUsername` y `create` para evitar interacciones reales con la base de datos.
 * - `JwtService`: Se mockea la función `sign` para simular la generación de un token JWT.
 * 
 * NOTAS:
 * - Prueba de seguridad: Aunque las pruebas aseguran que el sistema responde correctamente en distintos escenarios de autenticación, no están diseñadas para validar la seguridad real de las contraseñas ni del token generado.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../modules/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));


describe('AuthService', () => {
  let authService: AuthService;

// Mock de los servicios de usuarios y JWT, que son inyectados en el servicio `AuthService`
  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('debería lanzar Unauthorized si el usuario no existe', async () => {
       // Simulamos que no se encuentra el usuario en la base de datos
      mockUserService.findByUsername.mockResolvedValue(null);

       // Se espera que se lance una excepción UnauthorizedException
      await expect(authService.signin('user', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar Unauthorized si el password no coincide', async () => {
      // Usuario mockeado con contraseña incorrecta
      const user = { id: 1, username: 'user', password: 'hashedPass', email: 'a@a.com' };
      mockUserService.findByUsername.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false); // Simulamos que la contraseña no es correcta

      // Se espera que se lance una excepción UnauthorizedException
      await expect(authService.signin('user', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });

    it('debería retornar un token si las credenciales son válidas', async () => {
      // Usuario mockeado con contraseña correcta
      const mockUser = { id: 1, email: 'mail@mail.com', username: 'user', password: '$2b$10$yk2z2cIP6bTIOedmnwjkbuYoe92iQtzES9OXdUJBQKX82cV6yz8y.' };

      // Mock de la comparación de contraseñas
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);  // Simulamos una comparación exitosa

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mockedToken');

      const result = await authService.signin('mail@mail.com', '123456');

      expect(result).toEqual({
        access_token: 'mockedToken',
      });

      expect(mockUserService.findByUsername).toHaveBeenCalledWith('mail@mail.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
    });
  });

  describe('signup', () => {
    it('debería crear un usuario y retornar mensaje con user', async () => {
      // Datos de nuevo usuario
      const createdUser = { id: 1, username: 'user', email: 'mail@mail.com', password: 'hashedPassword' };

      // Simulamos que el hash de la contraseña es exitoso
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$yk2z2cIP6bTIOedmnwjkbuYoe92iQtzES9OXdUJBQKX82cV6yz8y.');

      // Simulamos la creación del usuario en la base de datos
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await authService.signup('mail@mail.com', '123456', 'user');

      expect(result).toEqual({
        message: 'Se creo el usuario exitosamente',
        user: createdUser,
      });
      
      // Simulamos una respuesta exitosa.
      expect(mockUserService.create).toHaveBeenCalledWith({
        email: 'mail@mail.com',
        password: '$2b$10$yk2z2cIP6bTIOedmnwjkbuYoe92iQtzES9OXdUJBQKX82cV6yz8y.',
        username: 'user',
      });
    });
  });
});
