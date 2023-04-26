import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number = 10;
}
