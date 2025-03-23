import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { AuthFacade } from '../application/service/auth.facade';
import { UserResponse } from '../application/interface/user-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authFacade.createUser(createUserDto);
  }
}
