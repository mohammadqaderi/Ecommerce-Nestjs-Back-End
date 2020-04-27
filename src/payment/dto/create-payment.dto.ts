import { PaymentMethod } from '../payment-methods.enum';
import { IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsIn([
    PaymentMethod.VISA,
    PaymentMethod.PAYPAL,
    PaymentMethod.CASH_ON_DELIVERY,
    PaymentMethod.MASTERCARD,
    PaymentMethod.PURCHASE_ORDER
  ])
  payment_method: PaymentMethod;
}
