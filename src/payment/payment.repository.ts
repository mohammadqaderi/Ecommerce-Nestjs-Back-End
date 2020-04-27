import { EntityRepository, Repository } from "typeorm";
import { Payment } from "./payment.entity";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {

}