import { Column, Entity } from 'typeorm';
import { TEntity } from './t-entity';

@Entity()
export class Location extends TEntity {
  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'area', nullable: true })
  area: string;

  @Column({ name: 'lga', nullable: true })
  lga: string;

  @Column({ name: 'state', nullable: true })
  state: string;

  @Column({ name: 'nationality', nullable: true })
  nationality: string;
}
