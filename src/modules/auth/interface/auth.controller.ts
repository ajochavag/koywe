import { Body, Controller, Post } from '@nestjs/common';
import { AuthFacade } from '../application/service/auth.facade';
import { UserResponse } from '../application/interface/user-response.interface';
import { LoginUserDto, CreateUserDto } from '../application/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authFacade.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<UserResponse> {
    return this.authFacade.login(loginUserDto);
  }
}
