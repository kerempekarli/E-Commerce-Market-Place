import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(Number(id));
  }

  @Post()
  async createOrder(@Body() body: { userId: number; items: { productId: number; quantity: number; price: number }[] }) {
    return this.orderService.createOrder(body.userId, body.items);
  }
}
