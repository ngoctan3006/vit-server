import { BaseEntity } from 'src/shares/entities';
import { Position, UserJoinStatus } from 'src/shares/enums';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_club')
export class UserClubEntity extends BaseEntity {
  @Column()
  clubId: ObjectId | string;

  @Column()
  userId: ObjectId | string;

  @Column({ type: 'enum', enum: Position, default: Position.THANH_VIEN })
  position: Position;

  @Column({
    type: 'enum',
    enum: UserJoinStatus,
    default: UserJoinStatus.REGISTERED,
  })
  status: UserJoinStatus;
}
