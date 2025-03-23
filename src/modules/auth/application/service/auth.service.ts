import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { USER_REPOSITORY, UserRepository } from '../repository/user.repository';
import { User } from '../../domain/user.domain';
import { AuthError } from '../exceptions/auth.error.enum';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '../interface/user-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne(username);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const existingUser = await this.findOne(createUserDto.username);

      if (existingUser) {
        throw new ConflictException(AuthError.USER_ALREADY_EXISTS);
      }

      const user = new User({
        username: createUserDto.username.toLowerCase().trim(),
        password: bcrypt.hashSync(createUserDto.password, 10),
      });

      const createdUser = await this.userRepository.createUser(user);
      const { password, ...userWithoutPassword } = createdUser;

      return {
        ...userWithoutPassword,
        token: this.getJWTToken({ username: createdUser.username }),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new ConflictException(AuthError.FAILED_TO_CREATE_USER);
    }
  }

  private getJWTToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
