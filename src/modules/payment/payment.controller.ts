import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: { orderId: number; amount: number; method: string }) {
    return this.paymentService.createPayment({
      orderId: body.orderId, // Doğru property adı kullanıldı
      amount: body.amount,
      method: body.method,
      status: 'PENDING',
    });
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.paymentService.updatePaymentStatus(Number(id), body.status);
  }
}
