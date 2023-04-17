import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { mailConfig } from 'src/config/mail.config';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRootAsync(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
