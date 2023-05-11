import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UploadModule } from '../upload/upload.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UploadModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
