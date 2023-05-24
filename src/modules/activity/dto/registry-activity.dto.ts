import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

export class RegistryActivityDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  @Type(() => Number)
  times: number[];
}
