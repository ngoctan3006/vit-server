import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { EmailConsumer } from './consumers/email.consumer';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailConsumer],
  exports: [UserService],
})
export class UserModule {}
