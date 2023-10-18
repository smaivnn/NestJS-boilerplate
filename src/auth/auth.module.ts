import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './database/auth.repository';
import { UserRepository } from 'src/user/database/user.repository';
import { AccessStrategy } from './jwt/access.strategy';
import { RefreshStrategy } from './jwt/refresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/user/database/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    PassportModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    AccessStrategy,
    RefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
