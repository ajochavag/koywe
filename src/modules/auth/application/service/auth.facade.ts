import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto';
import { AuthService } from './auth.service';
import { UserResponse } from '../interface/user-response.interface';

@Injectable()
export class AuthFacade {
  constructor(private readonly authService: AuthService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authService.createUser(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponse> {
    return this.authService.login(loginUserDto);
  }
}
