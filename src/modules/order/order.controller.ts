import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() body: { userId: number; items: { productId: number; quantity: number; price: number }[] }) {
    return this.orderService.createOrder(body);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orderService.updateStatus(+id, body.status);
  }
}
