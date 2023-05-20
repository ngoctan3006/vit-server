import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ActivityTimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  end_time: Date;
}
