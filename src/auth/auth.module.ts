import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './database/auth.repository';
import { AccessStrategy } from './jwt/access.strategy';
import { RefreshStrategy } from './jwt/refresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/user/database/user.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/database/user.entity';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './jwt/google.strategy';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    PassportModule,
    JwtModule,
    UserModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    AccessStrategy,
    RefreshStrategy,
    GoogleStrategy,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
