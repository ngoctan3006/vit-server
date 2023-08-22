import { BaseEntity } from 'src/shares/entities';
import { UserJoinStatus } from 'src/shares/enums';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_activity')
export class UserActivity extends BaseEntity {
  @Column()
  userId: ObjectId;

  @Column()
  activityId: ObjectId;

  @Column()
  timeId: ObjectId;

  @Column({
    type: 'enum',
    enum: UserJoinStatus,
    default: UserJoinStatus.REGISTERED,
  })
  status: UserJoinStatus;
}
