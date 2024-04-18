import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../database/user.repository';
import { Role } from 'src/constants/role.enum';
import { UserDeactiveDto } from '../dto/user.deactive.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return await this.userRepository.findAllUser();
  }

  async updateUserRoles(id: string, role: Role) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.updateUserRoles(user, role);
  }

  async deactivateUser(request, id: string, body: UserDeactiveDto) {
    /**
     * - 본인의 결제 금액과 관련해서 소멸하는 것에 대한 동의
     * - 탈퇴 해도 게시판 글은 그대로
     * - 30일간은 데이터 보존
     * - 탈퇴시 비밀번호 확인
     * - 탈퇴 사유
     */

    const { user } = request;
    const { password, deleteReason } = body;
    if (user.id !== id) {
      throw new Error('different user');
    }

    try {
      const isPasswordMatching = bcrypt.compare(password, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('password not matching');
      }
      await this.userRepository.deactivateUser(user, deleteReason);
    } catch (error) {
      throw new Error('Failed to deactivate user');
    }
  }
}
