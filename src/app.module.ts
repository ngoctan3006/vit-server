import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { EventModule } from './modules/event/event.module';
import { MailModule } from './modules/mail/mail.module';
import { EmailProcessor } from './modules/mail/processors/email.processor';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { EnvConstant } from './shares/constants/env.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    MailModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>(EnvConstant.REDIS_HOST),
        port: configService.get<number>(EnvConstant.REDIS_PORT),
        username: configService.get<string>(EnvConstant.REDIS_USERNAME),
        password: configService.get<string>(EnvConstant.REDIS_PASSWORD),
        ttl: configService.get<number>(EnvConstant.CACHE_TTL),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(EnvConstant.REDIS_HOST),
          port: configService.get<number>(EnvConstant.REDIS_PORT),
          username: configService.get<string>(EnvConstant.REDIS_USERNAME),
          password: configService.get<string>(EnvConstant.REDIS_PASSWORD),
        },
      }),
      inject: [ConfigService],
    }),
    UploadModule,
    ActivityModule,
    EventModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailProcessor],
})
export class AppModule {}
