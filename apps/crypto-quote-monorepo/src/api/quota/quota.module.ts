import { CryptomktService, QuotaRepository, QuotaService } from '@monorepo/core-domain-services';
import { CreateQuotaUseCase, GetQuotaUseCase } from '@monorepo/core-use-cases';
import { CryptomktServiceImpl, PrismaQuotaRepository, QuotaServiceImpl } from '@monorepo/infrastructure';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QuotaController } from './quota.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [QuotaController],
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => new PrismaClient(),
    },
    {
      provide: CryptomktService,
      useFactory: (httpService: HttpService) => new CryptomktServiceImpl(httpService),
      inject: [HttpService],
    },
    {
      provide: QuotaRepository,
      useFactory: (prismaClient: PrismaClient) => new PrismaQuotaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: QuotaService,
      useFactory: (quotaRepository: QuotaRepository) => new QuotaServiceImpl(quotaRepository),
      inject: [QuotaRepository],
    },
    {
      provide: CreateQuotaUseCase,
      useFactory: (cryptomktService: CryptomktService, quotaService: QuotaService) => new CreateQuotaUseCase(cryptomktService, quotaService),
      inject: [CryptomktService, QuotaService],
    },
    {
      provide: GetQuotaUseCase,
      useFactory: (quotaService: QuotaService) => new GetQuotaUseCase(quotaService),
      inject: [QuotaService],
    },
  ],
})
export class QuotaModule {}
