import { Position } from 'src/shares/enums';

export class JwtPayload {
  id: string;
  username: string;
  position: Position;
  iat?: number;
  exp?: number;
}
