import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CartService } from '../cart/cart.service';
import {CartItem} from '../cart/cart-item.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private cartService: CartService,
  ) {}

  async getProducts(
  ): Promise<Product[]> {
    return await this.productRepository.getProducts();
  }

  async getProduct(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with id: ${productId} is not found `,
      );
    }
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProduct(id);
    const result = await this.productRepository.delete(product);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id: ${id} is not found `);
    }
  }

  async insertToCart(
    productId: number,
    cartId: number
  ): Promise<CartItem> {
    const cart_item = await this.cartService.getCartItem(cartId);
    const product = await this.getProduct(productId);
      product.quantity = product.quantity - 1;
      cart_item.products.push(product);
      cart_item.total_products += 1;
      await cart_item.save();
      await product.save();
      return cart_item;
  }


  async removeFromCart(productId: number, cartId: number): Promise<void> {
    const cart_item = await this.cartService.getCartItem(cartId);
    const product = await this.getProduct(productId);
      cart_item.products.splice(0, 1, product);
      product.quantity = product.quantity + 1;
      cart_item.total_products -= 1;
      await cart_item.save();
      await product.save();
    } 

}
