/**
 * Pruebas unitarias para el servicio `UserService`.
 *
 * Validar de forma aislada el comportamiento de la lógica del servicio de usuarios (`UserService`),
 * simulando el acceso a la base de datos mediante un mock del `PrismaDAL`.
 *
 * Objetivos de estas pruebas:
 * - Creación de un usuario con datos básicos.
 * - Búsqueda de un usuario por `username`.
 * - Búsqueda de un usuario por `email`.
 *
 * - Se utiliza Jest para mockear los métodos de `PrismaDAL`.
 * - Cada prueba valida que el método correspondiente de `PrismaDAL` haya sido invocado con los parámetros esperados.
 * - Se limpia el mock después de cada prueba con `jest.clearAllMocks()` para evitar efectos colaterales.
 *
 * Consideraciones futuras:
 * - Agregar pruebas para manejo de errores (e.g. usuario no encontrado, errores de base de datos).
 * - Verificar validaciones previas en la capa de servicio si se implementan.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { PrismaDAL } from '../../../prisma/prisma.dal';

describe('UserService', () => {
  let service: UserService;
  let prismaDAL: PrismaDAL;

  const mockPrismaDAL = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaDAL,
          useValue: mockPrismaDAL,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaDAL = module.get<PrismaDAL>(PrismaDAL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear un usuario', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
    };

    mockPrismaDAL.user.create.mockResolvedValue(mockUser);

    const result = await service.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
    });

    expect(mockPrismaDAL.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'testuser',
      },
    });
    expect(result).toEqual(mockUser);
  });

  it('debería encontrar un usuario por username', async () => {
    const username = 'testuser';
    const mockUser = { id: 1, username };

    mockPrismaDAL.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.findByUsername(username);

    expect(mockPrismaDAL.user.findUnique).toHaveBeenCalledWith({ where: { username } });
    expect(result).toEqual(mockUser);
  });

  it('debería encontrar un usuario por email', async () => {
    const email = 'test@example.com';
    const mockUser = { id: 1, email };

    mockPrismaDAL.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.findByEmail(email);

    expect(mockPrismaDAL.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(result).toEqual(mockUser);
  });
});