import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { DeleteResult, Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../auth/user.entity';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { Payment } from '../payment/payment.entity';
import { Invoice } from '../invoice/invoice.entity';
import { OrderItem } from './order_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {OrderStatus} from  './order-status.enum'
@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {
  }

  async findUserOrders(user: User): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: {
        user,
      },
    });
    if (!orders) {
      throw new NotFoundException(`User has no orders`);
    }

    let today = new Date();
    for(let i=0; i < orders.length; i++) {
    
      let date = orders[i].order_date;
      const threeDaysLater = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3);
      const eightDaysLater = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);

      if(threeDaysLater.getDate() === today.getDate()){
            orders[i].status = OrderStatus.SHIPPED;
            await orders[i].save();
       }
      else if(eightDaysLater.getDate() === today.getDate()){
            orders[i].status = OrderStatus.DELIVERED;
            await orders[i].save();
      } 
      else {
             orders[i].status = OrderStatus.PROCESSED
        }
    }
    return orders;
  }

  async findOrder(user: User, id: number): Promise<Order> {
    const order = this.orderRepository.findOne({
      where: {
        user,
        id,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async deleteOrder(user: User, orderId: number): Promise<void> {
    const order = await this.findOrder(user, orderId);
    const result = await this.orderRepository.delete(order);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
  }

  async findOrderItem(id: number): Promise<OrderItem> {
    const order_item = this.orderItemRepository.findOne({
      where: {
        id,
      },
    });
    if (!order_item) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }
    return order_item;
  }

  async deleteOrderItem(id: number): Promise<void> {
    const order_item = await this.findOrderItem(id);
    const result = await this.orderItemRepository.delete(order_item);
    if (result.affected === 0) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }
  }

  async completeOrder(
    user: User,
    orderId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    const order = user.orders.find(order => order.id === orderId);
    const { payment_method } = createPaymentDto;
    const payment = new Payment();
    payment.date = new Date();
    payment.client = user;
    payment.payment_method = payment_method;
    const invoice = await this.createInvoice(user, payment, order);
    order.invoice = invoice;
    payment.invoice = invoice;
    payment.amount = invoice.invoice_total;
    try {
      user.payments.push(await payment.save());
      await order.save();
    } catch (error) {
      console.error(error);
    }
  }

  async createInvoice(
    user: User,
    payment: Payment,
    order: Order,
  ): Promise<Invoice> {
    const today = new Date();
    const invoice = new Invoice();
    invoice.client = user;
    invoice.order = order;
    invoice.invoice_date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    invoice.due_date = nextWeek;
    invoice.payment = payment;
    let total_amount = 0;

    for (let i = 0; i < order.order_items.length; i++) {
      total_amount += order.order_items[i].totalPrice;
    }

    invoice.invoice_total = total_amount;
    invoice.payment_date = payment.date;
    invoice.number = `${Math.random() + '-' + Date.now() + '.'}`;

    try {
      user.invoices.push(await invoice.save());
      return invoice;
    } catch (error) {
      console.error(error);
    }
  }
}
