import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { mailConfig } from 'src/config/mail.config';
import { MailQueueService } from './services/mail-queue.service';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync(mailConfig),
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  providers: [MailService, MailQueueService],
  exports: [MailService, MailQueueService],
})
export class MailModule {}
