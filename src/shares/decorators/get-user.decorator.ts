import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.user) return data ? req.user[data] : req.user;

    try {
      let token = req.headers.authorization;
      if (token.startsWith('Bearer ')) token = token.slice(7);
      return new JwtService().verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
);
