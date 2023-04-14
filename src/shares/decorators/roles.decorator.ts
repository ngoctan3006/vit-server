import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Position } from '@prisma/client';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Position[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard, JwtGuard)
  );
};
