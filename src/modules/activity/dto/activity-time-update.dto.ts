import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ActivityTimeDto } from './activity-time.dto';

export class ActivityTimeUpdateDto extends ActivityTimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
