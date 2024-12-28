// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';
import { WingPaymentStrategy } from './strategies/wing-payment.strategy';
import { ABAPaymentStrategy } from './strategies/aba-payment.strategy';
import { BCELOnePaymentStrategy } from './strategies/bcelone-payment.strategy';
// vs.
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), HttpModule],
  providers: [PaymentService, PaymentStrategyFactory, WingPaymentStrategy, ABAPaymentStrategy, BCELOnePaymentStrategy],
  exports: [PaymentService], // Başka modüllerde kullanabilmek için
})
export class PaymentModule {}
