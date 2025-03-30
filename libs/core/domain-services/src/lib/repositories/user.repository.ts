import { User } from '@monorepo/core-domain';

export abstract class UserRepository {
  abstract create(user: User): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
