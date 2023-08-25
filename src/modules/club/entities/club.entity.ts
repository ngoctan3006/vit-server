import { BaseEntity } from 'src/shares/entities';
import { Column, Entity, ObjectId } from 'typeorm';

@Entity('club')
export class ClubEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  departmentId: ObjectId | string;
}
