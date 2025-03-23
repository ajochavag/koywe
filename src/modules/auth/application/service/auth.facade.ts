import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserResponse } from '../interface/user-response.interface';

@Injectable()
export class AuthFacade {
  constructor(private readonly authService: AuthService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authService.createUser(createUserDto);
  }
}
