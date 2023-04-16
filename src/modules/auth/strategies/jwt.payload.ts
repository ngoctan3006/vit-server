import { Position } from '@prisma/client';

export class JwtPayload {
  id: number;
  username: string;
  position: Position;
  iat?: number;
  exp?: number;
}
