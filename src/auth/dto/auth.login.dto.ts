import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/database/user.entity';
import { Expose } from 'class-transformer';

export class AuthLoginDto extends PickType(UserEntity, ['email'] as const) {
  @Expose()
  password: string;
}
