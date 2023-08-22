import { UserJoinStatus } from 'src/shares/enums';

export interface Member {
  id: number;
  username: string;
  fullname: string;
  avatar: string | null;
  status: UserJoinStatus;
}

export interface GetMemberResponseDto {
  id: number;
  name: string;
  member: Member[];
}
