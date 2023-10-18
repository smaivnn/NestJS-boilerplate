import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { AuthRepository } from '../database/auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: configService.get('REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: Payload) {
    try {
      const refreshTokenFromCookie = request.cookies?.refresh_token;
      const foundUser =
        await this.authRepository.validateUserByIdWithoutPassword(payload.sub);

      if (!foundUser) {
        throw new Error('해당하는 유저는 없습니다.');
      }
      const checkTokenMathing = await this.authRepository.compareRefreshToken(
        foundUser.refreshToken,
        refreshTokenFromCookie,
      );

      if (checkTokenMathing) {
        return foundUser;
      } else {
        throw new Error('변조된 토큰.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
