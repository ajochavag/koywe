import { Module } from '@nestjs/common';
import { QuoteModule } from './modules/quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuoteModule,
    CommonModule,
    AuthModule,
  ],
})
export class AppModule {}
