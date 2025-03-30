import { User } from '@monorepo/core-domain';
import { UserService } from '../user.service';

export const userServiceMock: UserService = {
  create: (_user: Partial<User>) => Promise.resolve() as any,
  findByEmail: (_email: string) => Promise.resolve() as any,
};
