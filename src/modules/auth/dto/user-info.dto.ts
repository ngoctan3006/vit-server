import { Position } from '@prisma/client';

export class UserInfo {
  id: string;
  username: string;
  fullname: string;
  position: Position;
}
