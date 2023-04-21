import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApproveDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  eventId: number;
}
