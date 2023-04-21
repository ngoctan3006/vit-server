import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { EmailConsumer } from './consumers/email.consumer';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail',
    }),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailConsumer],
  exports: [UserService],
})
export class UserModule {}
