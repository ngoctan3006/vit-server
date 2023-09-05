import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  deadline: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;
}
