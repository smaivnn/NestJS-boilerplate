import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/database/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const foundUser = await this.userModel.findOne({ email });

    return foundUser;
  }

  async getUser() {
    const foundUserList = await this.userModel.find();
    return foundUserList;
  }
}
