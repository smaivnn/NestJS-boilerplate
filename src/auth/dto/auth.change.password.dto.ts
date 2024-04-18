import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/user/database/user.entity';

export class AuthChangePasswordDto extends PickType(UserEntity, [] as const) {
  @Expose()
  password: string;

  @IsString()
  newPassword: string;
}
