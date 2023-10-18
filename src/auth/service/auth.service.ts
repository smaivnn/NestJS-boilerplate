import { Response, Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './../database/auth.repository';
import { Types } from 'mongoose';
import { UserRequestDto } from 'src/user/dto/user.request.dto';
import { LoginRequestDto } from '../dto/login.request.dto';
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
    sub: string | Types.ObjectId;
  }) {
    const accessToken = this.jwtService.sign(data, {
      secret: this.configService.get('ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(data, {
      secret: this.configService.get('REFRESH_SECRET'),
      expiresIn: '20m',
    });

    return { accessToken, refreshToken };
  }

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.authRepository.handleSignup({
      email,
      name,
      password: hashedPassword,
    });

    return newUser.readOnlyData;
  }

  async jwtLocalLogin(
    data: LoginRequestDto,
    response: Response,
    request: Request,
  ) {
    const { email, password } = data;
    const clientIp = request.ip;

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

    const payload = { email: email, sub: foundUser.id, roles: foundUser.roles };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    await this.authRepository.setRefreshToken(foundUser, refreshToken);
    await this.authRepository.setClientIpAddress(foundUser, clientIp);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getNewAccessToken(data, response: Response) {
    response.clearCookie('refresh_token');
    const payload = { email: data.email, sub: data.id, roles: data.roles };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    await this.authRepository.setRefreshToken(data, refreshToken);

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

  async logout(data, response: Response) {
    response.clearCookie('refresh_token');
    await this.authRepository.setRefreshToken(data);
    return {
      redirect: 'URL',
    };
  }
}
