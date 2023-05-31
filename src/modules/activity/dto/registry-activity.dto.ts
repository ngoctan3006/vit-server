import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegistryActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  timeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  activityId: number;
}
