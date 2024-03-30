import { Response, Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './../database/auth.repository';
import { UserRegisterDTO } from 'src/user/dto/user.register.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { UserRepository } from 'src/user/database/user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(data: {
    email: string;
    id: string;
    role: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: this.configService.get('ACCESS_SECRET'),
        expiresIn: '15s',
      }),
      this.jwtService.signAsync(data, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: '20m',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async register(body: UserRegisterDTO): Promise<void> {
    const { email, username, nickname, password } = body;

    const foundUser = await this.userRepository.findUserByEmail(email);
    if (foundUser) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authRepository.handleSignup({
      email,
      username,
      password: hashedPassword,
      nickname,
    });
  }

  async jwtLocalLogin(
    body: AuthLoginDto,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = body;

    const foundUser = await this.userRepository.findUserByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }
    const validatePassword: boolean = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, id: foundUser.id, role: foundUser.role };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    await this.authRepository.setRefreshToken(foundUser.id, refreshToken);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getNewAccessToken(
    request: any,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    response.clearCookie('refresh_token');
    const { user } = request;

    const { accessToken, refreshToken } = await this.generateTokens({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    await this.authRepository.setRefreshToken(user.id, refreshToken);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUser(request: Request) {
    const user = await this.userRepository.getUser();
    console.log(request.user);
    return user;
  }

  async logout(request: any, response: Response) {
    const { user } = request;
    response.clearCookie('refresh_token');
    await this.authRepository.invalidateRefreshToken(user.id);
    return {
      redirect: 'URL',
    };
  }

  async compareRefreshToken(
    hashedRefreshToken: string,
    tokenFromCookie: string,
  ): Promise<boolean> {
    const isRefreshTokenMatching = await bcrypt.compare(
      tokenFromCookie,
      hashedRefreshToken,
    );
    return isRefreshTokenMatching;
  }
}
