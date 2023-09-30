import { UserJoinStatus } from '@prisma/client';

export interface Member {
  id: string;
  username: string;
  fullname: string;
  avatar: string | null;
  status: UserJoinStatus;
}

export interface GetMemberResponseDto {
  id: string;
  name: string;
  member: Member[];
}
