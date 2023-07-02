import { UserActivityStatus } from '@prisma/client';

export class GetMemberResponseDto {
  id: number;
  name: string;
  member: {
    id: number;
    username: string;
    fullname: string;
    avatar: string | null;
    status: UserActivityStatus;
  }[];
}
