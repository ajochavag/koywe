import User from '../user/user';

export interface SignupResponse {
  message: string;
  user: User;
}

export interface SigninResponse {
  access_token: string;
  user: User;
}
