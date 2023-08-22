import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('activity')
export class ActivityEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  deadline: Date;

  @Column()
  eventId?: ObjectId;
}
