import { authResponseMock, loginUserMock } from '@monorepo/core-domain';
import { authServiceMock } from '@monorepo/core-domain-services';
import { GetUserUseCase } from './get-user';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserUseCase(authServiceMock);
  });

  it('should login user successfully', async () => {
    jest.spyOn(authServiceMock, 'login').mockResolvedValue(authResponseMock);

    const result = await useCase.execute(loginUserMock);

    expect(result).toEqual(authResponseMock);
    expect(authServiceMock.login).toHaveBeenCalledWith(loginUserMock.email, loginUserMock.password);
  });

  it('should throw error when login fails', async () => {
    const error = new Error('Invalid credentials');
    jest.spyOn(authServiceMock, 'login').mockRejectedValue(error);

    await expect(useCase.execute(loginUserMock)).rejects.toThrow('Invalid credentials');
    expect(authServiceMock.login).toHaveBeenCalledWith(loginUserMock.email, loginUserMock.password);
  });
});
