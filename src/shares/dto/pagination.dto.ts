import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ required: false })
  page: number = 1;

  @ApiProperty({ required: false })
  limit: number = 10;
}
