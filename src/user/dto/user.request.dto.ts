import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../database/user.entity';

export class UserRequestDto extends PickType(UserEntity, [
  'email',
  'username',
  'password',
] as const) {}
