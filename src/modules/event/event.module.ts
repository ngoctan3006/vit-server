import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [UserModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
