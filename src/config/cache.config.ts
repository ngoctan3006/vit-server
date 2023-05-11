import { ConfigService } from '@nestjs/config';
import { EnvConstant } from 'src/shares/constants';

export const cacheConfig = (configService: ConfigService) => ({
  host: configService.get<string>(EnvConstant.REDIS_HOST),
  port: configService.get<number>(EnvConstant.REDIS_PORT),
  username: configService.get<string>(EnvConstant.REDIS_USERNAME),
  password: configService.get<string>(EnvConstant.REDIS_PASSWORD),
  ttl: configService.get<number>(EnvConstant.CACHE_TTL),
});
