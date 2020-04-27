import {
  PrimaryGeneratedColumn,
  Entity,
  BaseEntity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  unit_price: number;

  @Column({
    nullable: true
  })
  quantity: number;

  @Column('float')
  totalPrice: number
  
  @ManyToOne(type => Product, product => product.order_items, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  product: Product;

  @ManyToOne(type => Order, order => order.order_items, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  order: Order;

  @Column()
  productId: number;

  @Column()
  orderId: number;
}
