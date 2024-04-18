import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRegisterDTO } from '../dto/auth.register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/database/user.entity';
import { Repository, DataSource } from 'typeorm';
import { account_status } from 'src/constants/user.enum';
import { UserOAuthRegisterDTO } from 'src/auth/dto/auth.OAuth.register.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userDbAccess: Repository<UserEntity>,
  ) {}

  async handleSignup(
    body: UserRegisterDTO | UserOAuthRegisterDTO,
  ): Promise<UserEntity> {
    try {
      const newUser = await this.userDbAccess.save(body);
      return newUser;
    } catch (error) {
      throw new Error('회원가입에 실패했습니다.');
    }
  }

  async handleOAuthSignup(body: UserOAuthRegisterDTO): Promise<UserEntity> {
    try {
      const newUser = await this.userDbAccess.save(body);
      return newUser;
    } catch (error) {
      throw new Error('회원가입에 실패했습니다.');
    }
  }

  async setRefreshToken(id: string, token: string): Promise<void> {
    try {
      await this.userDbAccess.update({ id }, { refreshToken: token });
    } catch (error) {
      throw new Error('Failed to set refresh token');
    }
  }

  async invalidateRefreshToken(id: string): Promise<void> {
    try {
      await this.userDbAccess.update({ id }, { refreshToken: null });
    } catch (error) {
      throw new Error('Failed to invalidate refresh token');
    }
  }

  async activateRegisterAccount(email: string): Promise<void> {
    try {
      await this.userDbAccess.update(
        { email },
        { status: account_status.ACTIVE },
      );
    } catch (error) {
      throw new Error('Failed to activate register account');
    }
  }

  async changePassword(id: string, hashedPassword: string): Promise<void> {
    try {
      await this.userDbAccess.update({ id }, { password: hashedPassword });
    } catch (error) {
      throw new error('Failed to change password');
    }
  }
}
