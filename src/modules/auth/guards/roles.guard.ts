import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shares/decorators';
import { Position } from 'src/shares/enums';
import { httpErrors } from 'src/shares/exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Position[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.position)) {
      throw new HttpException(httpErrors.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
