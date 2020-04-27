import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../order/order_item.entity';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('float',{
    default: 0.0
  })
  price: number;

  @Column({
    default: new Date()
  })
  publishedIn: Date;


  @Column({
    default: 1
  })
  quantity: number;
  
  @Column({
    nullable: true
  })
  image: string;
  @ManyToOne(type => Category, category => category.products, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  category: Category;

  @ManyToOne(type => CartItem, cartItem => cartItem.products, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  cartItem: CartItem;

  @OneToMany(type => OrderItem, orderItem => orderItem.product, {
    eager: true,

  })
  order_items: OrderItem[];
}
