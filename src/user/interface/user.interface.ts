import { oauth_provider } from 'src/constants/oauth.enum';
import { Role } from 'src/constants/role.enum';
import { account_status } from 'src/constants/user.enum';

export interface IUser {
  id: string;
  email: string;
  username: string;
  password?: string;
  nickname: string;
  phone_num?: string;
  birth?: Date;
  is_adult: boolean;
  status: account_status;
  refreshToken?: string;
  role: Role;
  oauth_provider: oauth_provider;
  oauth_provider_id: string;
  
}
