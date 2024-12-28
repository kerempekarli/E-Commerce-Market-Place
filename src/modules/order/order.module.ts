import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService], // Başka modüllerde kullanacaksanız
})
export class OrderModule {}
