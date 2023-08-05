import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { bullConfig, cacheConfig } from './config';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClubModule } from './modules/club/club.module';
import { CronModule } from './modules/cron/cron.module';
import { DepartmentModule } from './modules/department/department.module';
import { EventModule } from './modules/event/event.module';
import { GroupModule } from './modules/group/group.module';
import { MailModule } from './modules/mail/mail.module';
import { EmailProcessor } from './modules/mail/processors';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        ...cacheConfig(configService),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync(bullConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    MailModule,
    UploadModule,
    ActivityModule,
    EventModule,
    DepartmentModule,
    ClubModule,
    GroupModule,
    CronModule,
  ],
  controllers: [],
  providers: [EmailProcessor],
})
export class AppModule {}
