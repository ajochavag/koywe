import { Module } from '@nestjs/common';
import { QuoteModule } from './modules/quote/quote.module';
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [QuoteModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
