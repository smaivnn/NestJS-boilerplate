import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/constants/role.enum';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: '비밀 번호', default: '1234' })
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({ description: '닉네임', default: 'testNickname' })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @ApiProperty({ description: '토큰' })
  @Exclude()
  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({ description: '역할' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
