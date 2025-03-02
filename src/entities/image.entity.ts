import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TEntity } from './t-entity';
import { Property } from './property.entity';

@Entity()
export class Images extends TEntity {
  @Column({ name: 'link' })
  imageLink: string;

  @ManyToOne(() => Property, { nullable: true })
  @JoinColumn({ name: 'property_fk', referencedColumnName: 'pk' })
  property: Property;
}
