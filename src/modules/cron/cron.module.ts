import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { CronService } from './cron.service';

@Module({
  imports: [MailModule, UserModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
