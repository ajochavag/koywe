import { CreateQuotaUseCase, GetQuotaUseCase } from '@monorepo/core-use-cases';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateQuoteDto } from './dtos/quota.dto';

@Controller('quota')
export class QuotaController {
  constructor(private readonly createQuotaUseCase: CreateQuotaUseCase, private readonly getQuotaUseCase: GetQuotaUseCase) {
    /**/
  }

  @Post()
  public async create(@Body() data: CreateQuoteDto) {
    return await this.createQuotaUseCase.execute(data);
  }

  @Get('/:id')
  public async get(@Param('id') id: string) {
    return await this.getQuotaUseCase.execute(id);
  }
}
