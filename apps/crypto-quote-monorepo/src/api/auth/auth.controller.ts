import { AuthResponse } from '@monorepo/core-domain';
import { CreateUserUseCase, GetUserUseCase } from '@monorepo/core-use-cases';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase, private readonly getUserUseCase: GetUserUseCase) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.createUserUseCase.execute(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return await this.getUserUseCase.execute(loginUserDto);
  }
}
