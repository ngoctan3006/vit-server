import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [EventModule],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
