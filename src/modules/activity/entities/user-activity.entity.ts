import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';
import { UserActivityStatus } from '../enums';

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
    enum: UserActivityStatus,
    default: UserActivityStatus.REGISTERED,
  })
  status: UserActivityStatus;
}
