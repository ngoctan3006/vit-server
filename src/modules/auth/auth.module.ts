import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvConstant } from 'src/shares/constants';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(EnvConstant.JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get<number>(
            EnvConstant.JWT_ACCESS_TOKEN_EXPIRATION_TIME
          ),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
