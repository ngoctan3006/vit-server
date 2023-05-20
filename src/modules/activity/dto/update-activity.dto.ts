import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ActivityTimeUpdateDto, CreateActivityDto } from './';

export class UpdateActivityDto extends PartialType(
  OmitType(CreateActivityDto, ['times'])
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActivityTimeUpdateDto)
  times: ActivityTimeUpdateDto[];
}
