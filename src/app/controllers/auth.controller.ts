import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthFacade } from "src/context/auth/application/AuthFacade";
import { UserDto } from "../dto/UserDto";

@Controller('auth')
export class AuthController {
  constructor(private facade: AuthFacade) { }

  @Post('register')
  async register(@Body() { username, password }: UserDto) {
    return this.facade.signUp(username, password);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() { username, password }: UserDto) {
    return this.facade.logIn(username, password);
  }
}