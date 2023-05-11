import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Status } from '@prisma/client';
import { Request } from 'express';
import { httpErrors } from 'src/shares/exception';
import { UserService } from './../../user/user.service';

@Injectable()
export class FirstLoginGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new HttpException(
        httpErrors.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getUserInfoById(payload.id);
      if (user.status === Status.BLOCKED)
        throw new HttpException(httpErrors.BLOCKED_USER, HttpStatus.FORBIDDEN);
      if ((user.status = Status.ACTIVE))
        throw new HttpException(httpErrors.ACTIVE_USER, HttpStatus.FORBIDDEN);
      req['user'] = user;
      return true;
    } catch (error: any) {
      if (error.status === 403) throw error;
      throw new HttpException(
        httpErrors.TOKEN_EXPIRED,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
