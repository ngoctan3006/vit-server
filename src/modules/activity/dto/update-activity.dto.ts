import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ActivityTimeUpdateDto, CreateActivityDto } from './';

export class UpdateActivityDto extends OmitType(CreateActivityDto, ['times']) {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActivityTimeUpdateDto)
  times: ActivityTimeUpdateDto[];
}
