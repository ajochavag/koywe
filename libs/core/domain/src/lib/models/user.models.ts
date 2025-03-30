export class BaseUser {
  email: string;
  password: string;
}

export class CreateUser extends BaseUser {}

export class LoginUser extends BaseUser {}

export class User extends BaseUser {
  id: string;
}
