import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { Order } from '../order/order.entity';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { ProfileService } from '../profile/profile.service';
import { CartItem } from './cart-item.entity';
import { OrderItem } from '../order/order_item.entity';
import { Product } from '../product/product.entity';
import { Profile } from '../profile/profile.entity';
import { OrderService } from '../order/order.service';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly profileService: ProfileService,
    private readonly orderService: OrderService,
  ) {}

  async getCart(id: number, profile?: Profile): Promise<Cart> {
    let cart = null;
    if (id) {
      cart = this.cartRepository.findOne({
        id,
      });
    }
    if (profile) {
      cart = this.cartRepository.findOne({
        profile,
      });
    }

    if (!cart) {
      throw new NotFoundException(`Cart with id: ${id} not found`);
    }
    return cart;
  }

  async getCartItem(id: number, cart?: Cart): Promise<CartItem> {
    let cart_item = null;
    if (id) {
      cart_item = this.cartItemRepository.findOne({
        id,
      });
    }
    if (cart) {
      cart_item = this.cartItemRepository.findOne({
        cart,
      });
    }

    if (!cart_item) {
      throw new NotFoundException(`CartItem with id: ${id} not found`);
    }
    return cart_item;
  }

  async clearCartItemProducts(cart_item_id: number): Promise<CartItem> {
    const cart_item = await this.getCartItem(cart_item_id);
    cart_item.total_products = 0;
    cart_item.products = [];
    await cart_item.save();
    return cart_item;
  }

  async removeFromCart(cart_item_id: number, productId: number): Promise<CartItem> {
    const cart_item = await this.getCartItem(cart_item_id);
    if (cart_item) {
      const array = cart_item.products;
      for (let i = 0; i < array.length; i = i + 1) {
        if (array[i].id === productId) {
          const product = array.find(prod => {
            return prod.id === productId;
          });
          await product.save();
          array.splice(i, 1);
          cart_item.total_products = cart_item.total_products - 1;
          await cart_item.save();
        }
      }
      return cart_item;
    }
  }

  async deleteCart(cart: Cart): Promise<void> {
    await this.cartRepository.delete(cart);
  }

  async deleteCartItem(cart_item: CartItem): Promise<void> {
    await this.cartItemRepository.remove(cart_item);
  }

  async productCheckout(
    user: User,
    cartItemId: number,
    productId: number,
    createOrderDto: CreateOrderDto,
    createPaymentDto: CreatePaymentDto,
    quantity: number
  ): Promise<void> {
    const cart_item = await this.getCartItem(cartItemId);
    const product = cart_item.products.find(
      product => product.id === productId,
    );
    if (!product) {
      throw new NotFoundException(
        `Product  with id: ${productId}  not found in Cart`,
      );
    }

    const profile = await this.profileService.getProfileData(user);
    const order = await this.createOrder(user, createOrderDto, profile);
    const order_item = await this.createOrderItem(order, product, quantity);
    order.order_items.push(order_item);
    product.order_items.push(order_item);
    try {
      const savedOrder = await order.save();
      user.orders.push(savedOrder);
      await product.save();
      await this.removeFromCart(cartItemId, productId);
      await this.orderService.completeOrder(user, order.id, createPaymentDto);
    } catch (error) {
      console.error(error);
    }
  }

  async cartCheckout(
    user: User,
    cart_item_id: number,
    createOrderDto: CreateOrderDto,
    createPaymentDto: CreatePaymentDto,
    cartProductsQuantity: any
  ): Promise<void> {
    const profile = await this.profileService.getProfileData(user);
    const cart_item = await this.getCartItem(cart_item_id);
    const order = await this.createOrder(user, createOrderDto, profile);
    for (let i = 0; i < cart_item.products.length; i++) {
      const product = cart_item.products[i];
      if (!product) {
        throw new NotFoundException(`Product is not found in this Cart`);
      }
      const productQuantity  = cartProductsQuantity[i];
      const order_item = await this.createOrderItem(order, product, productQuantity);
      order.order_items.push(order_item);
      product.order_items.push(order_item);
      await product.save();
    }
    try {
      const savedOrder = await order.save();
      user.orders.push(savedOrder);
      await this.clearCartItemProducts(cart_item_id);
      await this.orderService.completeOrder(user, order.id, createPaymentDto);
    } catch (error) {
      console.error(error);
    }
  }

  async createOrder(
    user: User,
    createOrderDto: CreateOrderDto,
    profile: Profile,
  ): Promise<Order> {
    const order = new Order();
    const { comments } = createOrderDto;
    order.comments = comments;
    order.user = user;
    const today = new Date();
    const threeDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
    order.shipmentDate = threeDaysLater;
    order.shippedTo = profile.address;
    order.order_date = new Date();
    order.order_items = [];

    try {
      await order.save();
      return order;
    } catch (error) {
      console.error(error);
    }
  }

  async createOrderItem(order: Order, product: Product, productQuantity: any): Promise<OrderItem> {
    const order_item = new OrderItem();
    order_item.order = order;
    order_item.product = product;
    order_item.quantity = productQuantity;
    order_item.unit_price = product.price;
    order_item.totalPrice = order_item.unit_price * order_item.quantity;

    try {
      await order_item.save();
      return order_item;
    } catch (error) {
      console.error(error);
    }
  }
}
