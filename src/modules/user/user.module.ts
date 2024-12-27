import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, OrderService],
  controllers: [UserController, OrderController],
  exports: [UserService], // Başka modüllerde kullanmak isterseniz
})
export class UserModule {}
