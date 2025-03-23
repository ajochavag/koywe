import { User } from '../../domain/user.domain';

export interface UserResponse extends Omit<User, 'password'> {
  token: string;
}
