import { Injectable } from "@nestjs/common";
import { UserRegister } from "./UserRegister";
import { UserAuthenticator } from "./UserAuthenticator";

@Injectable()
export class AuthFacade {
  constructor(private register: UserRegister, private authenticator: UserAuthenticator) { }

  async signUp(username: string, password: string) {
    return await this.register.run(username, password);
  }

  async logIn(username: string, password: string) {
    return await this.authenticator.run(username, password);
  }
}