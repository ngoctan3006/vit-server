import { BaseEntity } from 'src/shares/entities';
import { Column, Entity } from 'typeorm';

@Entity('event')
export class EventEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  deadline: Date;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
}
