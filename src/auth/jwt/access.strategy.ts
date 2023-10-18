import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { AuthRepository } from '../database/auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    try {
      const user = await this.authRepository.validateUserByIdWithoutPassword(
        payload.sub,
      );
      if (user) {
        return user;
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
