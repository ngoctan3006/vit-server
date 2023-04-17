import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { mailConfig } from 'src/config/mail.config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [MailerModule.forRootAsync(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
