import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { httpErrors } from 'src/shares/exception';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(httpErrors.TOKEN_INVALID, HttpStatus.UNAUTHORIZED)
      );
    }
    return user;
  }
}
