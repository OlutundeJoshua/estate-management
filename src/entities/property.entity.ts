import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TEntity } from './t-entity';
import { PaymentStatus, PropertyCategory } from '../enums/enums';
import { Images } from './image.entity';
import { User } from './users.entity';
import { Location } from './location.entity';

@Entity()
export class Property extends TEntity {
  @Column({
    name: 'is_sold',
    default: 0,
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  sold: number;

  @Column({
    name: 'is_approved',
    default: 0,
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  approved: number;

  @Column({ name: 'payment_status', default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ name: 'price', nullable: true })
  price: string;

  @Column({ name: 'property_id' })
  propertyId: string;

  @Column({ name: 'bathrooms', nullable: true })
  bathroom: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'toilets', nullable: true })
  toilets: number;

  @Column({ name: 'parking_space', nullable: true })
  parkingSpace: number;

  @Column({ name: 'bedroom', nullable: true })
  rooms: number;

  @Column({ name: 'category', default: PropertyCategory.APARTMENT })
  category: PropertyCategory;

  @OneToMany(() => Images, (images) => images.property, { nullable: true })
  images: Images[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_fk', referencedColumnName: 'pk' })
  user: User;

  @OneToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_fk', referencedColumnName: 'pk' })
  location: Location;
}
