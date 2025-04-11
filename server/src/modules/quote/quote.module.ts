import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteBLL } from './quote.bll';
import { QuoteRepository } from './quote.repository';
import { QuoteProvider } from './quote.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [QuoteController],
  providers: [QuoteService, QuoteBLL, QuoteRepository, QuoteProvider],
})
export class QuoteModule {}
