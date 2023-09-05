import { UserInfo } from './user-info.dto';

export class ResponseLoginDto {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}
