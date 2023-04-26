import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
