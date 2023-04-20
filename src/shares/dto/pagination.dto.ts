import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? +value : 1))
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? +value : 10))
  @IsOptional()
  limit?: number;
}
