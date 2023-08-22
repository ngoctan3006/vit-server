import { Gender, Position } from 'src/shares/enums';

export class CreateUserDto {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  birthday?: string | number;
  gen?: number;
  hometown?: string;
  address?: string;
  school?: string;
  student_id?: string;
  class?: string;
  cccd?: string;
  date_join?: string | number;
  date_out?: string | number;
  gender?: Gender;
  position?: Position;
}
