import { Quota } from '@monorepo/core-domain';
import { CreateQuotaUseCase, GetQuotaUseCase } from '@monorepo/core-use-cases';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateQuoteDto } from './dtos/quota.dto';

@Controller('quota')
export class QuotaController {
  constructor(private readonly createQuotaUseCase: CreateQuotaUseCase, private readonly getQuotaUseCase: GetQuotaUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() data: CreateQuoteDto): Promise<Quota> {
    return await this.createQuotaUseCase.execute(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async get(@Param('id') id: string): Promise<Quota> {
    return await this.getQuotaUseCase.execute(id);
  }
}
