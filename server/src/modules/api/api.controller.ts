import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.services';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('currencies')
  async getCurrencies() {
    return this.apiService.getCurrencies();
  }
}
