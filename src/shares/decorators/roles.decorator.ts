import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Position } from '@prisma/client';
import { JwtGuard, RolesGuard } from 'src/modules/auth/guards';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Position[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGuard, RolesGuard)
  );
};
