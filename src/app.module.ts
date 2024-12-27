import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReviewModule } from './modules/review/review.module';
import { typeOrmConfig } from './config/typeorm.config'; // Eğer TS dosyası kullanıyorsanız
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    PaymentModule,
    ReviewModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
