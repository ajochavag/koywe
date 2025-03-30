import { AuthResponse, CreateUser } from '@monorepo/core-domain';
import { AuthService } from '@monorepo/core-domain-services';
import { ConflictException } from '@nestjs/common';

export class CreateUserUseCase {
  constructor(private readonly authService: AuthService) {}

  public async execute(user: CreateUser): Promise<AuthResponse> {
    const existingUser = await this.authService.get(user.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return await this.authService.register(user.email, user.password);
  }
}
