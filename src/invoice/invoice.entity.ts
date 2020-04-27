import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Payment } from '../payment/payment.entity';
import { Order } from '../order/order.entity';

@Entity('invoices')
@Unique(['number'])
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  invoice_total: number;

  @Column()
  invoice_date: Date;

  @Column()
  due_date: Date;

  @Column()
  payment_date: Date;

  @ManyToOne(type => User, user => user.invoices, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  client: User;

  @OneToOne(type => Payment, payment => payment.invoice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  payment: Payment;

  @OneToOne(type => Order, order => order.invoice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  order: Order;
}
