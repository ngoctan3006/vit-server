import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender, Position, UserStatus } from 'src/shares/enums';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  gen?: number;

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

  @ApiProperty({ required: false, enum: UserStatus })
  @IsOptional()
  @IsString()
  status?: UserStatus;

  @ApiProperty({ required: false, enum: Position })
  @IsOptional()
  @IsString()
  position?: Position;
}
