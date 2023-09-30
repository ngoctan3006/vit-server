import { SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { EnvConstant } from '../shares/constants';

export const bullConfig: SharedBullAsyncConfiguration = {
  useFactory: (configService: ConfigService) => ({
    redis: {
      host: configService.get<string>(EnvConstant.REDIS_HOST),
      port: configService.get<number>(EnvConstant.REDIS_PORT),
      username: configService.get<string>(EnvConstant.REDIS_USERNAME),
      password: configService.get<string>(EnvConstant.REDIS_PASSWORD),
    },
  }),
  inject: [ConfigService],
};
