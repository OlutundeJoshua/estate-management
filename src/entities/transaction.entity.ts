import { Column, Entity } from 'typeorm';
import { TEntity } from './t-entity';
import { PaymentStatus, TransactionStatus } from '../enums/enums';

@Entity()
export class Transactions extends TEntity {
  @Column({ name: 'completed', default: TransactionStatus.PENDING })
  completed: TransactionStatus;

  @Column({ name: 'payment_status', default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
}
