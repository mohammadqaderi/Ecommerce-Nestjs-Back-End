import { forwardRef, Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from './invoice.repository';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../auth/auth.constants';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceRepository]),
    forwardRef(() => AuthModule),
    PassportModule.register({
      defaultStrategy: jwtConstants.strategy,
    })],

  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {
}
