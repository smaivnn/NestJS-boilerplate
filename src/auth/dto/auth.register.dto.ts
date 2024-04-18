import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from '../../user/database/user.entity';

export class UserRegisterDTO extends PickType(UserEntity, [
  'email',
  'username',
  'nickname',
] as const) {
  @ApiProperty({ description: '비밀번호', default: '1234' })
  @IsString()
  password: string;
}
