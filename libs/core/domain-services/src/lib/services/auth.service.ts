import { AuthResponse, User } from '@monorepo/core-domain';

export abstract class AuthService {
  abstract get(email: string): Promise<User | null>;
  abstract login(email: string, password: string): Promise<AuthResponse>;
  abstract register(email: string, password: string): Promise<AuthResponse>;
}
