/**
 * Este archivo contiene las pruebas unitarias para el servicio AuthService.
 *
 * En estas pruebas, se utiliza el patrón de inyección de dependencias de NestJS para
 * garantizar que el servicio AuthService y sus dependencias (como UserService y JwtService)
 * estén correctamente integrados. Aunque el servicio UserService no se utiliza directamente
 * en este test, su inyección sigue siendo esencial para garantizar que las dependencias del 
 * servicio AuthService estén bien definidas. 
 *
 * Mantener la inyección de `userService` mockeado asegura que las pruebas reflejen de manera
 * adecuada cómo interactúan los componentes, y se asegura que el AuthService se prueba en
 * su totalidad, incluyendo sus dependencias.
 *
 * - No eliminar la línea de inyección de `userService`**, ya que es fundamental para la validez y cobertura
 *   de las pruebas unitarias.
 * - La línea de `eslint-disable-next-line @typescript-eslint/no-unused-vars` indica que esto no es un error
 *   y es un patrón común en las pruebas unitarias cuando la variable no es utilizada directamente, pero su
 *   presencia asegura que las dependencias están correctamente definidas.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { UserService } from '../../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mocking UserService y JwtService
const mockUserService = {
  create: jest.fn(),
  findByUsername: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked_token'),
};

describe('AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
   
    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('Debería crear un usuario con éxito', async () => {
      const userDto = { email: 'test@test.com', username: 'testuser', password: 'password123' };

      mockUserService.create.mockResolvedValue({
        email: userDto.email,
        username: userDto.username,
        password: await bcrypt.hash(userDto.password, 10),
      });

      const result = await authService.signup(userDto.email, userDto.password, userDto.username);

      expect(result.message).toBe('Se creo el usuario exitosamente');
      expect(result.user.email).toBe(userDto.email);
      expect(result.user.username).toBe(userDto.username);
    });
  });

  describe('signin', () => {
    it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
      const userDto = { username: 'testuser', password: 'password123' };

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      mockUserService.findByUsername.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        username: userDto.username,
        password: hashedPassword,
      });

      const result = await authService.signin(userDto.username, userDto.password);

      expect(result.access_token).toBe('mocked_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'test@test.com',
      });
    });

    it('Debería lanzar UnauthorizedException si no se encuentra el usuario', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(authService.signin('nonexistentuser', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.signin('nonexistentuser', 'password123')).rejects.toThrow(
        'Credenciales de usuario inválidas',
      );
    });

    it('Debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const userDto = { username: 'testuser', password: 'password123' };

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      mockUserService.findByUsername.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        username: userDto.username,
        password: hashedPassword,
      });

      await expect(authService.signin(userDto.username, 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.signin(userDto.username, 'wrongpassword')).rejects.toThrow(
        'Credenciales de password inválidas',
      );
    });
  });
});
