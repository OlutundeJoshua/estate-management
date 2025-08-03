import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'pk',
    type: 'bigint',
  })
  pk: number;

  @CreateDateColumn({ name: 'date_created', nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ name: 'date_modified' })
  dateModified: Date;

  @DeleteDateColumn({ name: 'date_deleted' })
  deletedAt: Date;
}
