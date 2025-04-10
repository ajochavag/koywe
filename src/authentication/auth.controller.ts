import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: {email: string, password: string, username: string}){
    return this.authService.signup(dto.email, dto.password, dto.username)
  }

  @Post('signin')
  signin(@Body() dto: {username: string, password: string}){
    return this.authService.signin(dto.username, dto.password)
  }
}
