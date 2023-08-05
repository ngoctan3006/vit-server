import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { CronService } from './cron.service';

@Module({
  imports: [MailModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
