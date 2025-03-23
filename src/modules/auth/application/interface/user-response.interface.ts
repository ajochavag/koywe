import { User } from '../../domain/user.domain';
import { Tokens } from './tokens.interface';

export interface UserResponse extends Omit<User, 'password'>, Tokens {}
