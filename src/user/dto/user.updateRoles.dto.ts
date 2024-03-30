import { IsString } from 'class-validator';

export class UpdateRolesDto {
  @IsString()
  role: string;
}
