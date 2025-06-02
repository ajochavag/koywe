import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { UserAuthenticator } from "src/context/auth/application/UserAuthenticator";
import { UserRepository } from "src/context/auth/domain/contracts/UserRepository";
import { JwtService } from "@nestjs/jwt";
import { hash } from 'bcrypt';

const username = 'testUsername';
const password = 'testPassword';

describe('UserAuthenticator', () => {
  let userAuthenticator: UserAuthenticator;
  let mockUserRepository: jest.Mocked<UserRepository>;
  const mockJwtService: Partial<JwtService> = {
    sign: jest.fn().mockReturnValue('test_token'),
  };

  beforeEach(() => {
    mockUserRepository = { create: jest.fn(), searchByUsername: jest.fn() };
    userAuthenticator = new UserAuthenticator(mockUserRepository, mockJwtService as JwtService);
    jest.clearAllMocks();
  });

  it('should login user successfully', async () => {
    const hashedPassword = await hash('testPassword', 10);

    (mockUserRepository.searchByUsername as jest.Mock).mockResolvedValue({ username, password: hashedPassword });

    const expected = await userAuthenticator.run(username, password);


    expect(mockUserRepository.searchByUsername).toHaveBeenCalledWith(username);
    expect(mockJwtService.sign).toHaveBeenCalled();
    expect(expected).toHaveProperty('access_token');
    expect(expected.access_token).toBe('test_token');
  });

  it('should throw unauthorized error for invalid credentials', async () => {

    (mockUserRepository.searchByUsername as jest.Mock).mockResolvedValue(null);

    await expect(userAuthenticator.run(username, password)).rejects.toThrow(UnauthorizedException);
  });
});