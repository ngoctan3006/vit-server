import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('group')
export class GroupEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  eventId: ObjectId;
}
