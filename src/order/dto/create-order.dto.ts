import { OrderStatus } from '../order-status.enum';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsIn([OrderStatus.PROCESSED, OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  status: OrderStatus;

  @IsNotEmpty()
  @IsString()
  comments: string;
}
