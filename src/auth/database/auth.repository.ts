import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';
import { UserRequestDto } from '../../user/dto/user.request.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async handleSignup(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async validateUserByIdWithoutPassword(
    userId: string | Types.ObjectId,
  ): Promise<User | null> {
    const foundUser = await this.userModel.findById(userId).select('-password');
    return foundUser;
  }

  async setRefreshToken(user, token: string = null): Promise<User | null> {
    const hashedToken = token != null ? await bcrypt.hash(token, 10) : '';
    user.refreshToken = hashedToken;
    await user.save();
    return user;
  }

  async setClientIpAddress(
    user,
    clientIp: string = null,
  ): Promise<User | null> {
    user.latestIp = clientIp;
    await user.save();
    return user;
  }

  async compareRefreshToken(
    hashedRefreshToken: string,
    tokenFromCookie: string,
  ) {
    const isRefreshTokenMatching = await bcrypt.compare(
      tokenFromCookie,
      hashedRefreshToken,
    );
    return isRefreshTokenMatching;
  }
}
