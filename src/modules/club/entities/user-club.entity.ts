import { Position, UserStatus } from 'src/modules/user/enums';
import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('user_club')
export class UserClubEntity extends BaseEntity {
  @Column()
  clubId: ObjectId;

  @Column()
  userId: ObjectId;

  @Column({ type: 'enum', enum: Position, default: Position.MEMBER })
  position: Position;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
