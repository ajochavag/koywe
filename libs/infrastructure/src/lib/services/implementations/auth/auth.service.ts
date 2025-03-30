import { AuthResponse, User } from '@monorepo/core-domain';
import { AuthService, UserService } from '@monorepo/core-domain-services';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TOKEN_EXPIRATION } from '../../../constants/auth.constants';
import { JwtPayload } from '../../../interfaces/jwt-payload';

export class AuthServiceImpl implements AuthService {
  private readonly jwtService: JwtService;

  constructor(private readonly userService: UserService) {
    this.jwtService = new JwtService({
      secret: process.env['JWT_SECRET'],
      signOptions: {
        expiresIn: TOKEN_EXPIRATION,
      },
    });
  }

  public async get(email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  public async register(email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create({ email, password: hashedPassword });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateJwt(user: User): AuthResponse {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: TOKEN_EXPIRATION,
    };
  }
}
