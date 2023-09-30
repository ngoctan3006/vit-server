import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserStatus } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { EnvConstant } from 'src/shares/constants';
import { httpErrors } from 'src/shares/exception';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        EnvConstant.JWT_ACCESS_TOKEN_SECRET
      ),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new HttpException(
        httpErrors.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException(httpErrors.BLOCKED_USER, HttpStatus.FORBIDDEN);
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new HttpException(httpErrors.INACTIVE_USER, HttpStatus.FORBIDDEN);
    }
    delete user.password;
    return user;
  }
}
