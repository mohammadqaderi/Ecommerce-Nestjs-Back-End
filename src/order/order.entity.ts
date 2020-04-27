import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.enum';
import { User } from '../auth/user.entity';
import { OrderItem } from './order_item.entity';
import { Invoice } from '../invoice/invoice.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: new Date(),
  })
  order_date: Date;

  @Column({
    default: 'PROCESSED'
  })
  status: OrderStatus;

  @Column({
    nullable: true,
  })
  shipmentDate: Date;

  @Column()
  comments: string;

  @Column()
  shippedTo: string;

  @ManyToOne(type => User, user => user.orders, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user: User;


  @OneToMany(type => OrderItem, orderItem => orderItem.order, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  order_items: OrderItem[];

  @OneToOne(type => Invoice, invoice => invoice.order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  invoice: Invoice;

  @Column({
  nullable: true
  })
  invoiceId: number;
}
