import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { PaymentMethod } from './payment-methods.enum';
import { Invoice } from '../invoice/invoice.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.payments, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  client: User;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column()
  payment_method: PaymentMethod;

  @OneToOne(type => Invoice, invoice => invoice.payment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  invoice: Invoice;

}
