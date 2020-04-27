import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { User } from '../auth/user.entity';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(private invoiceRepository: InvoiceRepository) {}

  
  async findInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find();
    return invoices;
  }
  async findInvoice(user: User, id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        client: user,
        id,

      },
    });
    if (!invoice) {
        InvoiceService.throwError(id);
    }
    return invoice;
  }
  async deleteInvoice(client: User, invoiceId: number): Promise<void> {
    const invoice = await this.findInvoice(client, invoiceId);
    const result = await this.invoiceRepository.delete(invoice);
    if (result.affected === 0) {
      InvoiceService.throwError(invoiceId);
    }
  }

  static throwError(invoiceId: number) {
    throw new NotFoundException(`Invoice with id ${invoiceId} not found!!`);
  }
}
