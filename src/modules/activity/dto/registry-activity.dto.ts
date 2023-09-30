import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegistryActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  timeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  activityId: string;
}
