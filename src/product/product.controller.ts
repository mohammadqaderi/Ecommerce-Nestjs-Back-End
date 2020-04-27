import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getProducts(
  ) {
    return this.productService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) productId) {
    return this.productService.getProduct(productId);
  }

  @UseGuards(AuthGuard())
  @Post(':productId/addtocart/:cart_item_id')
  insertToCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('cart_item_id', ParseIntPipe) cartId: number
  ) {
    return this.productService.insertToCart(productId, cartId);
  }
}
