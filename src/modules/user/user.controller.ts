import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }
}