import { authResponseMock, User } from '@monorepo/core-domain';
import { authServiceMock } from '@monorepo/core-domain-services';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(authServiceMock);
  });

  it('should create a user successfully', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(authServiceMock, 'get').mockResolvedValue(null);
    jest.spyOn(authServiceMock, 'register').mockResolvedValue(authResponseMock);

    const result = await useCase.execute(input);

    expect(result).toEqual(authResponseMock);
    expect(authServiceMock.get).toHaveBeenCalledWith(input.email);
    expect(authServiceMock.register).toHaveBeenCalledWith(input.email, input.password);
  });

  it('should throw ConflictException when user already exists', async () => {
    const input = {
      email: 'existing@example.com',
      password: 'password123',
    };

    const existingUser: User = {
      id: '123',
      email: input.email,
      password: 'hashedPassword',
    };

    jest.spyOn(authServiceMock, 'get').mockResolvedValue(existingUser);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
    expect(authServiceMock.get).toHaveBeenCalledWith(input.email);
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
});
