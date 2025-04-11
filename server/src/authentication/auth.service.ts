import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, username: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({ email, password: hashedPassword, username });
    return { message: 'Se creo el usuario exitosamente', user };
  }

  async signin(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credenciales de usuario inválidas');
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Credenciales de password inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
