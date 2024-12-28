// src/modules/payment/payment.controller.ts

import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMethod } from './enums/payment-method.enum';
import { OrderService } from '../order/order.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post(':orderId/process')
  async processPayment(@Param('orderId') orderId: number, @Body() body: { method: PaymentMethod; amount: number }) {
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    return this.paymentService.processPayment(order, body.method, body.amount);
  }

  @Post(':paymentId/refund')
  async refundPayment(@Param('paymentId') paymentId: number, @Body() body: { refundAmount: number }) {
    return this.paymentService.refundPayment(paymentId, body.refundAmount);
  }
}
