import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/modules/auth/guards';
import { Position } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Position[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGuard, RolesGuard)
  );
};
