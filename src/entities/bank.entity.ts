import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TEntity } from './t-entity';
import { User } from './users.entity';

@Entity()
export class Bank extends TEntity {
  @Column({ name: 'account_name' })
  accountName: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'account_number' })
  accountNumber: number;

  @OneToOne(() => User, (user) => user.bankInfo, { nullable: false })
  user: User;
}
