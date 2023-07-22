import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityTimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  number_require: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  end_time: Date;
}
