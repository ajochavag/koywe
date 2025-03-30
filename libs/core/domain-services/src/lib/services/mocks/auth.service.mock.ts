import { AuthService } from '../auth.service';

export const authServiceMock: AuthService = {
  get: (_email: string) => Promise.resolve() as any,
  login: (_email: string, _password: string) => Promise.resolve() as any,
  register: (_email: string, _password: string) => Promise.resolve() as any,
};
