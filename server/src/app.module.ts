/**
 *  AppModuel.
 *
 * Thorttle es configurado de manera global para todos los endpoints, para limitar tiempo y solicitudes.
 *
 * Si se desea usar el guard en un controlador para sobrescribir ttl y limit se debería
 * import { Throttle } from '@nestjs/throttler'; y luego en el endpoint utilizar:
 * `@Throttle(5, 10)` // Limita 5 peticiones cada 10 segundos, por ejemplo.
 */
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { QuoteModule } from './modules/quote/quote.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './modules/user/user.module';
import { ApiModule } from './modules/api/api.module'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuoteModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ApiModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //Limita el tiempo en el que se ejecutan las solicitudes.
        limit: 10, // Limita la cantidad de solicitudes.
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
