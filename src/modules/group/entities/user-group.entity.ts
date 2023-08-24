import { BaseEntity } from 'src/shares/entities';
import { Position, UserJoinStatus } from 'src/shares/enums';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_group')
export class UserGroupEntity extends BaseEntity {
  @Column()
  userId: ObjectId | string;

  @Column()
  groupId: ObjectId | string;

  @Column({ type: 'enum', enum: Position, default: Position.THANH_VIEN })
  position: Position;

  @Column({
    type: 'enum',
    enum: UserJoinStatus,
    default: UserJoinStatus.ACCEPTED,
  })
  status: UserJoinStatus;
}
