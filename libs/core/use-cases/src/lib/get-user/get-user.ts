import { AuthResponse, LoginUser } from '@monorepo/core-domain';
import { AuthService } from '@monorepo/core-domain-services';

export class GetUserUseCase {
  constructor(private readonly authService: AuthService) {}

  public async execute(user: LoginUser): Promise<AuthResponse> {
    return await this.authService.login(user.email, user.password);
  }
}
