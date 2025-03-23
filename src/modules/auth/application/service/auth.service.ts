import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../repository/user.repository';
import { User } from '../../domain/user.domain';
import { AuthError } from '../exceptions/auth.error.enum';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '../interface/user-response.interface';
import { LoginUserDto, CreateUserDto } from '../dto';

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
    const { username } = createUserDto;

    const normalizedUsername = username.toLowerCase().trim();

    try {
      const existingUser = await this.findOne(normalizedUsername);

      if (existingUser) {
        throw new ConflictException(AuthError.USER_ALREADY_EXISTS);
      }

      const user = new User({
        username: normalizedUsername,
        password: bcrypt.hashSync(createUserDto.password, 10),
      });

      const createdUser = await this.userRepository.createUser(user);
      return {
        id: createdUser.id,
        username: createdUser.username,
        token: this.getJWTToken({ username: createdUser.username }),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new ConflictException(AuthError.FAILED_TO_CREATE_USER);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponse> {
    const { username } = loginUserDto;

    const normalizedUsername = username.toLowerCase().trim();

    const user = await this.findOne(normalizedUsername);

    if (!user) {
      throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS);
    }

    const isPasswordValid = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS);
    }

    return {
      id: user.id,
      username: user.username,
      token: this.getJWTToken({ username: user.username }),
    };
  }

  private getJWTToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
