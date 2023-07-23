import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthday: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  gen: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hometown: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  school: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  student_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  class: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cccd: string;
}
