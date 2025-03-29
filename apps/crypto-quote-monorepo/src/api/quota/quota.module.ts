import { QuotaRepository, QuotaService } from '@monorepo/core-domain-services';
import { CreateQuotaUseCase, GetQuotaUseCase } from '@monorepo/core-use-cases';
import { CryptomktService, PrismaQuotaRepository, QuotaServiceImpl } from '@monorepo/infrastructure';
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { QuotaController } from './quota.controller';

const prismaClientProvider = {
  provide: PrismaClient,
  useFactory: () => {
    return new PrismaClient();
  },
};

@Module({
  imports: [],
  controllers: [QuotaController],
  providers: [
    prismaClientProvider,
    {
      provide: CryptomktService,
      useFactory: () => {
        return new CryptomktService();
      },
      inject: [],
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
      useFactory: (cryptomktService: CryptomktService, quotaService: QuotaService) => {
        return new CreateQuotaUseCase(cryptomktService, quotaService);
      },
      inject: [CryptomktService, QuotaService],
    },
    {
      provide: GetQuotaUseCase,
      useFactory: (quotaService: QuotaService) => {
        return new GetQuotaUseCase(quotaService);
      },
      inject: [QuotaService],
    },
  ],
})
export class QuotaModule {}
