import { oauth_provider } from './../../constants/oauth.enum';
import { Response, Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './../database/auth.repository';
import { UserRegisterDTO } from 'src/auth/dto/auth.register.dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { UserRepository } from 'src/user/database/user.repository';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { account_status } from 'src/constants/user.enum';
import { IUser } from 'src/user/interface/user.interface';
import { AuthChangePasswordDto } from '../dto/auth.change.password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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
        expiresIn: '3m',
      }),
      this.jwtService.signAsync(
        { id: data.id },
        {
          secret: this.configService.get('REFRESH_SECRET'),
          expiresIn: '20m',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async setRefreshTokenToUser(user: IUser, response) {
    const payload = { email: user.email, id: user.id, role: user.role };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    await this.authRepository.setRefreshToken(user.id, refreshToken);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(body: UserRegisterDTO): Promise<void> {
    const { email, username, nickname, password } = body;

    if (password.length < 8) {
      throw new UnauthorizedException('비밀번호는 8자리 이상이어야 합니다.');
    }
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

    await this.emailService.sendRegisterVerificationEmail(email);
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

    return this.setRefreshTokenToUser(foundUser, response);
  }

  async getNewAccessToken(
    request: any,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    response.clearCookie('refresh_token');
    const { user } = request;
    return this.setRefreshTokenToUser(user, response);
  }

  async getUser(request: Request) {
    const user = await this.userRepository.getUser();

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

  async activateRegisterAccount(email: string) {
    const foundUser = await this.userRepository.findUserByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    await this.authRepository.activateRegisterAccount(email);
  }

  async oAuthRegister(user): Promise<IUser> {
    const { email, firstName, lastName, picture, id } = user;

    let foundUser = await this.userRepository.findUserByEmail(email);
    if (!foundUser) {
      foundUser = await this.authRepository.handleSignup({
        email,
        username: `${firstName}${lastName}`,
        nickname: `${firstName}_${lastName}`,
        status: account_status.ACTIVE,
        oauth_provider: oauth_provider.GOOGLE,
        oauth_provider_id: id,
      });
    }
    return foundUser;
  }

  async changePassword(request, body: AuthChangePasswordDto) {
    const { user } = request;
    const { password, newPassword } = body;

    try {
      const isPasswordMatching = bcrypt.compare(password, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.authRepository.changePassword(user.id, hashedPassword);
    } catch (error) {
      throw new UnauthorizedException('비밀번호 변경에 실패했습니다.');
    }
  }
}
