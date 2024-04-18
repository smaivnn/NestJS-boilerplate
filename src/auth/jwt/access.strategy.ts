import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { accessPayload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/database/user.repository';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: accessPayload) {
    const user = await this.userRepository.findUserById(payload.id);
    if (user) {
      return user;
    } else {
      throw new Error('해당하는 유저는 없습니다.');
    }
  }
}
