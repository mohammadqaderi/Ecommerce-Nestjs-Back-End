import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GetAuthenticatedUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { Profile } from '../profile/profile.entity';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  getCart(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.getCart(cartId);
  }

}

@Controller('cart_items')
export class CartItemController {
  constructor(private readonly cartService: CartService) {
  }

  @UseGuards(AuthGuard())
  @Get(':cart_item_id')
  getCartItem(@Param('cart_item_id', ParseIntPipe) cart_item_id: number) {
    return this.cartService.getCartItem(cart_item_id);
  }

  @UseGuards(AuthGuard())
  @Delete(':cart_item_id/products/clear-products')
  clearProducts(@Param('cart_item_id', ParseIntPipe) cart_item_id: number) {
    return this.cartService.clearCartItemProducts(cart_item_id);
  }

  @UseGuards(AuthGuard())
  @Delete(':cart_item_id/products/:id/remove-from-cart')
  removeFromCart(@Param('cart_item_id', ParseIntPipe) cart_item_id: number,
                 @Param('id', ParseIntPipe) productId: number) {
    return this.cartService.removeFromCart(cart_item_id, productId);
  }

  @UseGuards(AuthGuard())
  @Post(':cart_item_id/products/:id/checkout')
  productCheckout(
    @GetAuthenticatedUser() user: User,
    @Param('cart_item_id', ParseIntPipe) cart_item_id: number,
    @Param('id', ParseIntPipe) productId: number,
    @Body('createOrderDto') createOrderDto: CreateOrderDto,
    @Body('createPaymentDto') createPaymentDto: CreatePaymentDto,
	@Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.productCheckout(
      user,
      cart_item_id,
      productId,
      createOrderDto,
      createPaymentDto,
      quantity
    );
  }

  @UseGuards(AuthGuard())
  @Post(':cart_item_id/checkout')
  cartCheckout(
    @GetAuthenticatedUser() user: User,
    @Param('cart_item_id', ParseIntPipe) cart_item_id: number,
    @Body('createOrderDto') createOrderDto: CreateOrderDto,
    @Body('createPaymentDto') createPaymentDto: CreatePaymentDto,
    @Body('cartProductsQuantity') cartProductsQuantity: any
  ) {
    return this.cartService.cartCheckout(
      user,
      cart_item_id,
      createOrderDto,
      createPaymentDto,
      cartProductsQuantity
    );
  }


}
