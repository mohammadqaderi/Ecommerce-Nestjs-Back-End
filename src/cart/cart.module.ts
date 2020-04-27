import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController, CartItemController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cart } from './cart.entity';
import { ProfileModule } from '../profile/profile.module';
import { CartItem } from './cart-item.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../auth/auth.constants';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    forwardRef(() => AuthModule),
    forwardRef(() => OrderModule),
    ProfileModule,
    PassportModule.register({
      defaultStrategy: jwtConstants.strategy    
    }),
  ],
  providers: [CartService],
  controllers: [CartController, CartItemController],
  exports: [CartService],
})
export class CartModule {}
