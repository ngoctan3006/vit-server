import { Position } from 'src/shares/enums';

export class JwtPayload {
  id: number;
  username: string;
  position: Position;
  iat?: number;
  exp?: number;
}
