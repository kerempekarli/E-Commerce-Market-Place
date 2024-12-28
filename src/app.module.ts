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
import { UserController } from './modules/user/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Tüm modüllerde kullanılabilsin
      envFilePath: '.env', // .env dosyasının yolu
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    PaymentModule,
    ReviewModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
