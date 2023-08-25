import { Gender, Position } from 'src/shares/enums';

export class CreateUserDto {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  birthday?: string | number | Date;
  gen?: number;
  hometown?: string;
  address?: string;
  school?: string;
  student_id?: string;
  class?: string;
  cccd?: string;
  date_join?: string | number | Date;
  date_out?: string | number | Date;
  gender?: Gender;
  position?: Position;
}
