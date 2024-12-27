// src/modules/payment/strategies/wing-payment.strategy.ts

import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';

@Injectable()
export class WingPaymentStrategy implements PaymentStrategy {
  async processPayment(params: { amount: number; orderId: number }): Promise<{
    status: 'SUCCESS' | 'FAIL';
    transactionId?: string;
    errorMessage?: string;
  }> {
    // 1. Wing API'ye bağlanarak ödeme isteği gönder
    // 2. Yanıtı parse et

    // Burada hayali bir çağrı simüle edelim:
    const wingApiResponse = {
      success: true,
      transactionId: 'WING123ABC',
    };

    if (wingApiResponse.success) {
      return {
        status: 'SUCCESS',
        transactionId: wingApiResponse.transactionId,
      };
    } else {
      return {
        status: 'FAIL',
        errorMessage: 'Wing API payment failed',
      };
    }
  }

  async refundPayment?(transactionId: string, amount: number): Promise<boolean> {
    // Wing API ile refund isteği
    return true;
  }
}
