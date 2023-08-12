import { UserActivityStatus } from '@prisma/client';

export interface Member {
  id: number;
  username: string;
  fullname: string;
  avatar: string | null;
  status: UserActivityStatus;
}

export interface GetMemberResponseDto {
  id: number;
  name: string;
  member: Member[];
}
