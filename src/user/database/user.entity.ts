import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/constants/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { oauth_provider } from 'src/constants/oauth.enum';
import { account_status } from 'src/constants/user.enum';

@Entity({
  name: 'USER',
}) // USER : 테이블 명
export class UserEntity extends CommonEntity {
  @ApiProperty({ description: '사용자 이메일', default: 'test@test.com' })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: '사용자 이름', default: 'tester' })
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @ApiProperty({ description: '비밀번호', default: '1234' })
  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  password: string;

  @ApiProperty({ description: '닉네임', default: 'testNickname' })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @ApiProperty({ description: '핸드폰 번호', default: '010-1234-5678' })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  phone_num: string;

  @ApiProperty({ description: '생년월일' })
  @IsDate()
  @Column({ type: 'date', nullable: true })
  birth: Date;

  @ApiProperty({ description: '성인여부' })
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  is_adult: boolean;

  @ApiProperty({ description: '계정상태' })
  @IsNumber()
  @Column({ type: 'int', nullable: false, default: account_status.INACTIVE })
  status: number;

  @ApiProperty({ description: '토큰' })
  @Exclude()
  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({ description: '역할' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @IsNotEmpty({ message: 'provider를 작성해주세요.' })
  @IsNumber()
  @Column({ type: 'int', nullable: false, default: oauth_provider.LOCAL })
  oauth_provider: number;

  @IsNotEmpty({ message: 'providerUserId를 작성해주세요.' })
  @IsString()
  @Column({ type: 'varchar', nullable: false, default: '0' })
  oauth_provider_id: string;

  @ApiProperty({ description: '프로필 이미지' })
  @IsString()
  @Column({ type: 'text', nullable: true })
  profile_img: string;

  @ApiProperty({ description: '탈퇴 여부' })
  @Column({ type: 'boolean', nullable: false, default: false })
  is_deleted: boolean;

  @ApiProperty({ description: '탈퇴 이유' })
  @Column({ type: 'text', nullable: true })
  deleteReason?: string;
}
