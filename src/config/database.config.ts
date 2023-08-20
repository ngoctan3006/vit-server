import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EnvConstant } from 'src/shares/constants';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    type: 'mongodb',
    url: configService.get(EnvConstant.DATABASE_URL),
    retryWrites: true,
    w: 'majority',
    entities: [__dirname + '/../modules/**/entities/*.entity.ts'],
    synchronize: true,
  }),
  inject: [ConfigService],
};
