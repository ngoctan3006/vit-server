import { Position } from 'src/shares/enums';
import { ObjectId } from 'typeorm';

export class JwtPayload {
  id: ObjectId | string;
  username: string;
  position: Position;
  iat?: number;
  exp?: number;
}
