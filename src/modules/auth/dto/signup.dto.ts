import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender, Position } from 'src/shares/enums';

export class SignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date_join: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date_out: string | number;

  @ApiProperty({ required: false, enum: Gender })
  @IsOptional()
  @IsString()
  gender: Gender;

  @ApiProperty({ required: false, enum: Position })
  @IsOptional()
  @IsString()
  position: Position;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isSendMail: Boolean;
}
