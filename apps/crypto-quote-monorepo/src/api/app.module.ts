import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QuotaModule } from './quota/quota.module';

@Module({
  imports: [QuotaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
