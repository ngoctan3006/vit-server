import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { httpErrors } from 'src/shares/exception';

@Injectable()
export class FirstLoginGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      req['user'] = await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
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
