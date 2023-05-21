import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityTimeDto } from './activity-time.dto';

export class ActivityTimeUpdateDto extends PartialType(ActivityTimeDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
