import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserEntity } from 'src/user/database/user.entity';

export class UserDeactiveDto extends PickType(UserEntity, [
  'deleteReason',
] as const) {
  @Expose()
  password: string;
}
