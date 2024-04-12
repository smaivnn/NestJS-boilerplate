import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../database/user.entity';

export class UserRegisterDTO extends PickType(UserEntity, [
  'email',
  'username',
  'nickname',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  @ApiProperty({ description: '비밀번호', default: '1234' })
  password: string;
}
