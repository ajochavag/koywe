import { userMock } from '@monorepo/core-domain';
import { UserRepository } from '@monorepo/core-domain-services';
import { UserServiceImpl } from './user.service';

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<UserRepository>;

    userService = new UserServiceImpl(userRepository);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      userRepository.create.mockResolvedValue(userMock);

      const result = await userService.create(userMock);

      expect(result).toEqual(userMock);
      expect(userRepository.create).toHaveBeenCalledWith(userMock);
    });

    it('should return null when creation fails', async () => {
      userRepository.create.mockResolvedValue(null);

      const result = await userService.create(userMock);

      expect(result).toBeNull();
      expect(userRepository.create).toHaveBeenCalledWith(userMock);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(userMock);

      const result = await userService.findByEmail(userMock.email);

      expect(result).toEqual(userMock);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userMock.email);
    });

    it('should return null when user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail(userMock.email);

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userMock.email);
    });
  });
});
