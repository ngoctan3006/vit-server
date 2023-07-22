import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class IsSendMailDto {
  @ApiProperty({
    type: Boolean,
    description: 'Is send mail to user?',
    required: false,
    default: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isSendMail: boolean;
}
