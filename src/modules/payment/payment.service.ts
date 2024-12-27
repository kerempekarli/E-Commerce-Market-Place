import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { id }, relations: ['order'] });
  }

  async createPayment(data: { orderId: number; amount: number; method: string; status: string }): Promise<Payment> {
    const payment = this.paymentRepository.create({
      order: { id: data.orderId } as Partial<Order>, // Partial<Order> ile sadece ID geçiyoruz
      amount: data.amount,
      method: data.method,
      status: data.status,
    });

    return this.paymentRepository.save(payment);
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new Error('Payment not found');
    }
    payment.status = status;
    return this.paymentRepository.save(payment);
  }
}
