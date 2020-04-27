import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { User } from '../auth/user.entity';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}


  async findPayments(client: User): Promise<Payment[]> {
      const payments = await this.paymentRepository.find({
      where: {
        client
      }
    });
    return payments;
  }
  async findPayment(client: User, id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: {
      client,
        id
      },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found!!`);
    }
    return payment;
  }
  async deletePayment(client: User, paymentId: number): Promise<void> {
    const payment = await this.findPayment(client, paymentId);
    const result = await this.paymentRepository.delete(payment);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with id ${paymentId} not found!!`);
    }
  }
}
