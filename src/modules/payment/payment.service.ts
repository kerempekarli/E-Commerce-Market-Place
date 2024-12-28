// src/modules/payment/payment.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly strategyFactory: PaymentStrategyFactory,
  ) {}

  /**
   * Bir sipariş için ödeme başlatır / tamamlar
   * @param order Sipariş entity’si
   * @param method Kullanıcının seçtiği ödeme yöntemi
   * @param amount Tutar
   */
  async processPayment(order: Order, method: PaymentMethod, amount: number) {
    // Payment kaydını PENDING olarak oluştur
    let payment = this.paymentRepository.create({
      order,
      method,
      amount,
      status: PaymentStatus.PENDING,
    });
    payment = await this.paymentRepository.save(payment);

    // Doğru stratejiyi seç
    const strategy = this.strategyFactory.getStrategy(method);

    // Strategy ile işlem
    const response = await strategy.processPayment({
      amount,
      orderId: order.id,
    });

    if (response.status === 'SUCCESS') {
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = response.transactionId;
      await this.paymentRepository.save(payment);
      return payment;
    } else {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
      throw new BadRequestException(`Payment Failed: ${response.errorMessage}`);
    }
  }

  /**
   * İade/Refund örneği
   */
  async refundPayment(paymentId: number, refundAmount: number): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId }, // ID ile arama yapmak için 'where' kullanılır
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    if (!payment.transactionId) {
      throw new BadRequestException('No transactionId for this payment');
    }

    // Strategy
    const strategy = this.strategyFactory.getStrategy(payment.method);

    // Refund destekleniyor mu?
    if (!strategy.refundPayment) {
      throw new BadRequestException('Refund not supported for this method');
    }

    const result = await strategy.refundPayment(payment.transactionId, refundAmount);
    if (result) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentRepository.save(payment);
      return true;
    }
    return false;
  }
}
