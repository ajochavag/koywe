import { Module } from '@nestjs/common';
import { ApiController } from './api.controller'
import { ApiService } from './api.services'

@Module({
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModuele {}
