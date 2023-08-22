import { BaseEntity } from 'src/shares/entities';
import { Position, UserJoinStatus } from 'src/shares/enums';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_department')
export class UserDepartmentEntity extends BaseEntity {
  @Column()
  userId: ObjectId;

  @Column()
  departmentId: ObjectId;

  @Column({ type: 'enum', enum: Position, default: Position.THANH_VIEN })
  position: Position;

  @Column({
    type: 'enum',
    enum: UserJoinStatus,
    default: UserJoinStatus.REGISTERED,
  })
  status: UserJoinStatus;
}
