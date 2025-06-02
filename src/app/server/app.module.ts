import { Module } from '@nestjs/common';
import { QuoteModule } from '../modules/quote.module';
import { AuthModule } from '../modules/auth.module';
import { DatabaseModule } from 'src/context/shared/infrastructure/mongo.module';


@Module({
  imports: [AuthModule, QuoteModule, DatabaseModule],
})
export class AppModule { }
