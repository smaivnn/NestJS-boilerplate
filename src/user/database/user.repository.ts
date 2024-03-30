import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/constants/role.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userDbAccess: Repository<UserEntity>,
  ) {}

  async findUserById(id: string): Promise<UserEntity | null> {
    try {
      const foundUser = await this.userDbAccess.findOne({ where: { id } });
      return foundUser;
    } catch (error) {
      console.error(error);
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const foundUser = await this.userDbAccess.findOne({ where: { email } });
      return foundUser;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserInfoWithoutSensitiveFields(id: string): Promise<UserEntity> {
    const foundUser = await this.userDbAccess
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.username',
        'user.nickname',
        'user.role',
      ])
      .where('user.id = :id', { id })
      .getOne();
    return foundUser;
  }

  async updateUserRoles(user: UserEntity, role: Role) {
    try {
      user.role = role;
      await this.userDbAccess.save(user);
    } catch (error) {
      throw new Error('Failed to update user roles. wrong role type.');
    }
  }

  async findAllUser(): Promise<UserEntity[]> {
    try {
      const foundUserList = await this.userDbAccess.find();
      return foundUserList;
    } catch (error) {
      console.error(error);
    }
  }

  async getUser() {
    const foundUserList = await this.userDbAccess.find();
    return foundUserList;
  }
}
