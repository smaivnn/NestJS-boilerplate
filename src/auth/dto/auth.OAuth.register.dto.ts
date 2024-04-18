import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UserEntity } from '../../user/database/user.entity';

export class UserOAuthRegisterDTO extends PickType(UserEntity, [
  'email',
  'username',
  'nickname',
] as const) {
  @ApiProperty({ description: '비밀번호', default: '1234' })
  @IsString()
  password?: string;

  @ApiProperty({ description: '계정상태' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  oauth_provider?: number;

  @IsOptional()
  @IsString()
  oauth_provider_id?: string;
}
