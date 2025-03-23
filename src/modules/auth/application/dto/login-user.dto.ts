import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ss123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
