import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TEntity } from './t-entity';
import { UserType } from '../enums/enums';
import { Bank } from './bank.entity';
import { Location } from './location.entity';

@Entity()
export class User extends TEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'email_address', unique: true, nullable: true })
  emailAddress: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'user_type', default: UserType.INDIVIDUAL })
  type: UserType;

  @Column({ name: 'promotion_consent', default: 0, type: 'numeric', precision: 1, scale: 0 })
  promotionConsent: number;

  @Column({ name: 'is_approved', default: 0, type: 'numeric', precision: 1, scale: 0 })
  approved: number;

  @OneToOne(() => Bank, { nullable: true })
  @JoinColumn({ name: 'bank_fk', referencedColumnName: 'pk' })
  bankInfo: Bank;

  @OneToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_fk', referencedColumnName: 'pk' })
  location: Location;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_expires_at', type: 'timestamp', nullable: true })
  resetTokenExpiresAt: Date;
}
