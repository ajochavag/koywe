import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
