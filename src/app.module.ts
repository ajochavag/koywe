import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteModule } from './modules/quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), QuoteModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
