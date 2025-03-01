import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// importo CurrencyModule
@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'username',
        password: 'password',
        database: 'database',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true //solo desarrollo
    }),
    CurrencyModule,
],
})
export class AppModule {}
