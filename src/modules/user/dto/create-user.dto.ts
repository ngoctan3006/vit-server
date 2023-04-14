import { ApiProperty } from '@nestjs/swagger';
import { Gender, Position } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hometown?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  student_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  class?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cccd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date_join?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date_out?: string;

  @ApiProperty({ required: false, enum: Gender })
  @IsOptional()
  @IsString()
  gender?: Gender;

  @ApiProperty({ required: false, enum: Position })
  @IsOptional()
  @IsString()
  position?: Position;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
