import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  end_time: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;
}
