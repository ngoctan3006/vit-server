import { BaseEntity } from 'src/shares/entities';
import { Position } from 'src/shares/enums';
import { Column, Entity } from 'typeorm';
import { Gender, UserStatus } from '../enums';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  bio: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column()
  avatar: string;

  @Column()
  gen: number;

  @Column()
  birthday: Date;

  @Column()
  hometown: string;

  @Column()
  address: string;

  @Column()
  school: string;

  @Column()
  studentId: string;

  @Column()
  class: string;

  @Column()
  cccd: string;

  @Column()
  date_join: Date;

  @Column()
  date_out: Date;

  @Column()
  last_login: Date;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @Column({ type: 'enum', enum: Position, default: Position.THANH_VIEN })
  position: Position;
}
