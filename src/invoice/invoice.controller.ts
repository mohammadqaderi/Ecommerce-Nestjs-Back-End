import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthenticatedUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  getUserInvoice(@GetAuthenticatedUser() user: User,
                 @Param('id', ParseIntPipe) invoiceId: number) {
    return this.invoiceService.findInvoice(user, invoiceId);
  }
}
