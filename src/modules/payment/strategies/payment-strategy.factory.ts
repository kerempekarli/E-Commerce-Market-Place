// src/modules/payment/strategies/payment-strategy.factory.ts
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStrategy } from './payment-strategy.interface';
import { WingPaymentStrategy } from './wing-payment.strategy';
import { ABAPaymentStrategy } from './aba-payment.strategy';
import { BCELOnePaymentStrategy } from './bcelone-payment.strategy';
// import PiPayStrategy, VisaStrategy, MastercardStrategy vs.

@Injectable()
export class PaymentStrategyFactory {
  constructor(
    private readonly wingPayment: WingPaymentStrategy,
    private readonly abaPayment: ABAPaymentStrategy,
    private readonly bcelOnePayment: BCELOnePaymentStrategy,
    // vs...
  ) {}

  getStrategy(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.WING:
        return this.wingPayment;
      case PaymentMethod.ABA:
        return this.abaPayment;
      case PaymentMethod.BCEL_ONE:
        return this.bcelOnePayment;
      // vs.
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}
