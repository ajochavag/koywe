import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'user123', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password from user' })
  @IsString()
  password: string;
}
