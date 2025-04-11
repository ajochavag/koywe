import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'claveSecretaParaDesarrollo',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }
    return payload;
  }
}
