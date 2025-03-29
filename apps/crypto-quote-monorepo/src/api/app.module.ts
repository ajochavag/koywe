import { Module } from '@nestjs/common';
import { QuotaModule } from './quota/quota.module';

@Module({
  imports: [QuotaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
