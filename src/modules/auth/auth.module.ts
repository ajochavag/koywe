import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { AuthService } from './application/service/auth.service';
import { AuthFacade } from './application/service/auth.facade';
import { CommonModule } from '../common/common.module';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from './application/repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 3600 },
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
})
export class AuthModule {}
