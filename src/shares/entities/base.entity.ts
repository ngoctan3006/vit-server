import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({ type: String })
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
