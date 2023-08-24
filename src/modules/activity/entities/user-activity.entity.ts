import { BaseEntity } from 'src/shares/entities';
import { Position, UserJoinStatus } from 'src/shares/enums';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_activity')
export class UserActivity extends BaseEntity {
  @Column()
  userId: ObjectId | string;

  @Column()
  activityId: ObjectId | string;

  @Column()
  timeId: ObjectId | string;

  @Column({
    type: 'enum',
    enum: UserJoinStatus,
    default: UserJoinStatus.REGISTERED,
  })
  status: UserJoinStatus;

  @Column({ type: 'enum', enum: Position, default: Position.THANH_VIEN })
  position: Position;
}
