import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../database/user.repository';
import { Role } from 'src/constants/role.enum';

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
}
