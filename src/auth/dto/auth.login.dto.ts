import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/database/user.schema';

export class AuthLoginDto extends PickType(User, [
  'email',
  'password',
] as const) {}
