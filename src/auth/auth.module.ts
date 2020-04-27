import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './auth.constants';
import { OrderModule } from '../order/order.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { ProfileModule } from '../profile/profile.module';
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: jwtConstants.strategy    
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() =>  OrderModule),
    forwardRef(() =>  CartModule),
    PaymentModule,
    ProfileModule,
    InvoiceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
