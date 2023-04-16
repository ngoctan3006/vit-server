import { Position } from '@prisma/client';

export class UserInfo {
  id: number;
  username: string;
  fullname: string;
  position: Position;
}
