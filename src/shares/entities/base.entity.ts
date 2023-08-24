import {
  CreateDateColumn,
  DeleteDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ObjectIdColumn()
  id: ObjectId | string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
