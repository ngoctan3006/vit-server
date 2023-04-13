import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
