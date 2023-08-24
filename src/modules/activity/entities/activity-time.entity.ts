import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('activity_time')
export class ActivityTimeEntity extends BaseEntity {
  @Column()
  activityId: ObjectId | string;

  @Column()
  name: string;

  @Column()
  numberRequire: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
}
