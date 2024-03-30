import { PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { UserEntity } from '../database/user.entity';

export class UserFindALLResponseDTO extends PickType(UserEntity, [
  'email',
  'username',
  'nickname',
] as const) {
  @IsArray()
  roles: string[];
}
