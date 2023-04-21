import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Position } from '@prisma/client';
import { ROLES_KEY } from 'src/shares/decorators/roles.decorator';

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
      throw new ForbiddenException('Not permission');
    }
    return true;
  }
}
