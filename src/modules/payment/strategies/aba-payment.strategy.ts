// src/modules/payment/strategies/aba-payment.strategy.ts

import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';

@Injectable()
export class ABAPaymentStrategy implements PaymentStrategy {
  async processPayment(params: {
    amount: number;
    orderId: number;
  }): Promise<{
    status: 'SUCCESS' | 'FAIL';
    transactionId?: string;
    errorMessage?: string;
  }> {
    // 1. ABA API call
    // 2. Yanıtı parse et
    // Örnek:

    const abaApiResponse = {
      status: 'OK',
      referenceId: 'ABA-XYZ-789',
    };

    if (abaApiResponse.status === 'OK') {
      return {
        status: 'SUCCESS',
        transactionId: abaApiResponse.referenceId,
      };
    } else {
      return {
        status: 'FAIL',
        errorMessage: 'ABA API error...',
      };
    }
  }
}
