/**
 * Módulo de Autenticación (`AuthModule`)
 *
 * Este módulo encapsula toda la lógica de autenticación de la aplicación,
 * incluyendo generación de JWT, validación de tokens y manejo de credenciales de usuario.
 *
 * 1. `PassportModule.register({ defaultStrategy: 'jwt' })`:
 *    - Registra el módulo de PassportJS dentro de NestJS con la estrategia por defecto `jwt`.
 *    - Esto le dice a NestJS que cuando se use un guard como `@UseGuards(AuthGuard())`, por defecto use la estrategia `'jwt'`.
 *    - Es necesario para que `JwtAuthGuard` funcione correctamente, ya que internamente hace `AuthGuard('jwt')`.
 *    - Si no se registra este módulo, cualquier intento de autenticación usando `jwt` fallará con:
 *       `Error: Unknown authentication strategy "jwt"`
 *
 * 2. `JwtModule.register(...)`:
 *    - Configura el módulo JWT de NestJS, permitiendo firmar y verificar tokens JWT.
 *    - Define:
 *        - `secret`: Clave usada para firmar los tokens.
 *        - `signOptions`: Configura cuánto tiempo son válidos los tokens (`15m` en este caso).
 *
 * Testing:
 * - Este módulo debe importarse en pruebas de integración si se está usando la estrategia `jwt`.
 * - Es obligatorio incluirlo para registrar correctamente `passport-jwt` y evitar errores durante tests.
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-token.strategy';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || (() => {  
        throw new Error('JWT_SECRET is not defined in environment variables');  
      })(),  
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '5m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
