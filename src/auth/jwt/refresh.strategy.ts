import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { refreshPayload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/database/user.repository';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly userRepository: UserRepository,
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

  async validate(request: Request, payload: refreshPayload) {
    try {
      const refreshTokenFromCookie = request.cookies?.refresh_token;
      const foundUser = await this.userRepository.findUserById(payload.id);

      if (!foundUser) {
        throw new Error('해당하는 유저는 없습니다.');
      }
      const isTokenMatch =
        foundUser.refreshToken === refreshTokenFromCookie ? true : false;

      if (isTokenMatch) {
        return foundUser;
      } else {
        throw new Error('변조된 토큰입니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
