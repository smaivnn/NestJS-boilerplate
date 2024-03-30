import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-access-token') {
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new HttpException('토큰이 만료되었습니다.', HttpStatus.FORBIDDEN);
      } else {
        throw new UnauthorizedException('잘못된 토큰입니다.');
      }
    }
    return user;
  }
}
