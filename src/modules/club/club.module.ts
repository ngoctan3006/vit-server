import { Module } from '@nestjs/common';
import { DepartmentModule } from '../department/department.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [DepartmentModule],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [ClubService],
})
export class ClubModule {}
