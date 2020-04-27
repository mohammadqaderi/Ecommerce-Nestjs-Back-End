import {
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
  BaseEntity,
  Column,
  OneToMany,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_products: number;

  @OneToMany(type => Product, product => product.cartItem, {
      eager: true,
  })
  products: Product[];

  @OneToOne(type => Cart, cart => cart.cart_item, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  cart: Cart;
}
