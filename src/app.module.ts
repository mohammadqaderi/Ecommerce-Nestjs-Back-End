import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { InvoiceModule } from './invoice/invoice.module';
import { MulterModule } from '@nestjs/platform-express';

import { ContactModule } from './contact/contact.module';
import { NodemailerModule } from '@crowdlinker/nestjs-mailer';
import { NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { AwsModule } from './shared/aws/aws.module';
import * as config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './files',
    }),
    NodemailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'user',
          pass:'pass',
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      },
    } as NodemailerOptions<NodemailerDrivers.SMTP>),
    AuthModule,
    AwsModule,
    CategoryModule,
    ProductModule,
    ProfileModule,
    OrderModule,
    PaymentModule,
    CartModule,
    InvoiceModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
