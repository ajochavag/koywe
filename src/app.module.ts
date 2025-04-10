import { Module } from '@nestjs/common';
import { QuoteModule } from './modules/quote/quote.module';
import { PrismaModule } from './modules/prisma/prisma.module'
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [QuoteModule, PrismaModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
