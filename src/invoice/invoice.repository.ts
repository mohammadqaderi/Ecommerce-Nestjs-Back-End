import { Repository, EntityRepository } from 'typeorm';
import { Invoice } from './invoice.entity';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {
    
}
