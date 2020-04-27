import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthenticatedUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @UseGuards(AuthGuard())
  @Delete(':id/cancel-order')
  cancelOrder(
    @GetAuthenticatedUser() user: User,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.deleteOrder(user, orderId);
  }

  @UseGuards(AuthGuard())
  @Get('/user-orders')
  getUserOrders(@GetAuthenticatedUser() user: User) {
    return this.orderService.findUserOrders(user);
  }

  @UseGuards(AuthGuard())
  @Get('/user-orders/:id')
  getUserOrder(@GetAuthenticatedUser() user: User,
               @Param('id', ParseIntPipe) orderId: number) {
    return this.getUserOrder(user, orderId);
  }

}

