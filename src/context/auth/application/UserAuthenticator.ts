import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from 'bcrypt';
import { JwtService as Jwt } from '@nestjs/jwt';
import { UserRepository } from "../domain/contracts/UserRepository";

@Injectable()
export class UserAuthenticator {
  constructor(@Inject('UserRepository')
  private readonly userRepository: UserRepository,
    private readonly jwt: Jwt) { }

  async run(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.searchByUsername(username);

    if (!user || !(await compare(password, user.password))) throw new UnauthorizedException('Invalid credentials');

    return { access_token: this.jwt.sign({ username, sub: username }) };

  }
}