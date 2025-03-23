import { Body, Controller, Post } from '@nestjs/common';
import { AuthFacade } from '../application/service/auth.facade';
import { UserResponse } from '../application/interface/user-response.interface';
import { LoginUserDto, CreateUserDto } from '../application/dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  LoginOperation,
  LoginResponses,
  RegisterOperation,
  RegisterResponses,
} from '../swagger/auth.swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}

  @Post('register')
  @ApiOperation(RegisterOperation)
  @ApiResponse(RegisterResponses.CREATED)
  @ApiResponse(RegisterResponses.USER_EXISTS)
  @ApiResponse(RegisterResponses.CREATION_ERROR)
  @ApiResponse(RegisterResponses.BAD_REQUEST)
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authFacade.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation(LoginOperation)
  @ApiResponse(LoginResponses.SUCCESS)
  @ApiResponse(LoginResponses.UNAUTHORIZED)
  @ApiResponse(LoginResponses.BAD_REQUEST)
  @ApiBody({ type: LoginUserDto })
  login(@Body() loginUserDto: LoginUserDto): Promise<UserResponse> {
    return this.authFacade.login(loginUserDto);
  }
}
