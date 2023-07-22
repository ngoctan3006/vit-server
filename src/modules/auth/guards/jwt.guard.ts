import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { httpErrors } from 'src/shares/exception';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err)
      throw (
        err ||
        new HttpException(httpErrors.TOKEN_INVALID, HttpStatus.UNAUTHORIZED)
      );
    if (!user)
      throw new HttpException(
        httpErrors.TOKEN_EXPIRED,
        HttpStatus.UNAUTHORIZED
      );

    return user;
  }
}
