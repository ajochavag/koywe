import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { hash } from 'bcrypt';
import { UserRepository } from "../domain/contracts/UserRepository";

@Injectable()
export class UserRegister {
  constructor(@Inject('UserRepository')
  private readonly userRepository: UserRepository) { }

  async run(username: string, password: string) {
    const user = await this.userRepository.searchByUsername(username);

    if (user) throw new ConflictException('Username already exists');

    const hashedPassword = await hash(password, 10);

    await this.userRepository.create(username, hashedPassword);
  }
}