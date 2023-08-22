import { BaseEntity } from 'src/shares/entities';
import { Column, Entity } from 'typeorm';

@Entity('department')
export class DepartmentEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
