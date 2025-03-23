import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { AuthService } from './application/service/auth.service';
import { AuthFacade } from './application/service/auth.facade';
import { CommonModule } from '../common/common.module';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from './application/repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFacade,
    JwtStrategy,
    ConfigService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [AuthFacade, JwtStrategy, PassportModule],
})
export class AuthModule {}
