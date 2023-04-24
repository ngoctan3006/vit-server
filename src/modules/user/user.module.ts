import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UploadModule,
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
