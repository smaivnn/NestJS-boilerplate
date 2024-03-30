import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRegisterDTO } from '../../user/dto/user.register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/database/user.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userDbAccess: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async handleSignup(body: UserRegisterDTO): Promise<void> {
    try {
      await this.userDbAccess.save(body);
    } catch (error) {
      throw new Error('회원가입에 실패했습니다.');
    }
  }

  async setRefreshToken(id: string, token: string): Promise<void> {
    try {
      const hashedToken = token != null ? await bcrypt.hash(token, 10) : '';
      await this.userDbAccess.update({ id }, { refreshToken: hashedToken });
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
}
