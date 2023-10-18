import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'smaivnn@kakao.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password1234',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'johnDoe',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'jwt-code',
    description: 'refreshToken',
  })
  @Prop({})
  @IsString()
  refreshToken: string;

  @ApiProperty({
    example: '127.0.0.1',
    description: 'logged in IP address',
  })
  @Prop({})
  @IsString()
  latestIp: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'user roles',
    required: false,
    type: [String],
  })
  @Prop({
    default: ['user'],
  })
  @IsArray()
  roles: string[];

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
  };
}

const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});

_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
