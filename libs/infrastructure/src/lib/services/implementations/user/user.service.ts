import { User } from '@monorepo/core-domain';
import { UserRepository, UserService } from '@monorepo/core-domain-services';

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(user: User): Promise<User | null> {
    return await this.userRepository.create(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
