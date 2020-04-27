import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Profile } from '../profile/profile.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToOne(type => Profile, profile => profile.cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profile: Profile;

  @OneToOne(type => CartItem, cart_item => cart_item.cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  cart_item: CartItem;

  @Column()
  cartItemId: number;
}
