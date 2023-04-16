import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class SignupDto extends CreateUserDto {}
