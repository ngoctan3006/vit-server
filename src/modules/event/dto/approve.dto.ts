import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsString()
  eventId: string;
}
