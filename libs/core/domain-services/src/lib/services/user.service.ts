import { User } from '@monorepo/core-domain';

export abstract class UserService {
  abstract create(user: Partial<User>): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
