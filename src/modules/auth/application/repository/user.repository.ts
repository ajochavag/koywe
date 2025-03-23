import { User } from '../../domain/user.domain';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository {
  findOne(username: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
}
