import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ActivityTimeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end_time: string;
}
