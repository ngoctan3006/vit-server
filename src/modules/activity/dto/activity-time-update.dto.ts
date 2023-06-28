import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ActivityTimeDto } from './activity-time.dto';

export class ActivityTimeUpdateDto extends ActivityTimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
