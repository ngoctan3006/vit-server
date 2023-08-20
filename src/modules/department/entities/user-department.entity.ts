import { Position, UserStatus } from 'src/modules/user/enums';
import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_department')
export class UserDepartmentEntity extends BaseEntity {
  @Column()
  userId: ObjectId;

  @Column()
  departmentId: ObjectId;

  @Column({ type: 'enum', enum: Position, default: Position.MEMBER })
  position: Position;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
