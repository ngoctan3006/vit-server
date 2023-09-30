import { Position } from '@prisma/client';

export class JwtPayload {
  id: string;
  username: string;
  position: Position;
  iat?: number;
  exp?: number;
}
