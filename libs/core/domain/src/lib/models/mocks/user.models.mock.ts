import { BaseUser, CreateUser, LoginUser, User } from '../user.models';

export const baseUserMock: BaseUser = {
  email: 'test@example.com',
  password: 'test123',
};

export const createUserMock: CreateUser = {
  email: 'newuser@example.com',
  password: 'newuser123',
};

export const loginUserMock: LoginUser = {
  email: 'login@example.com',
  password: 'login123',
};

export const userMock: User = {
  id: '1234-5678-9012',
  email: 'user@example.com',
  password: 'user123',
};
