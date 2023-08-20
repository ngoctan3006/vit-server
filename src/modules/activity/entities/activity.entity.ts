import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

export class ActivityTime {
  id: ObjectId;
  name: string;
  numberRequire: number;
  startTime: Date;
  endTime: Date;
}

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
  eventId: ObjectId;

  @Column({ array: true })
  times: ActivityTime[];
}
