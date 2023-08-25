import { User } from 'src/modules/user/entities';

export class ResponseLoginDto {
  accessToken: string;
  refreshToken: string;
  user: User;
}
