import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { HttpService } from '@nestjs/axios'; // Düzeltildi

@Injectable()
export class BCELOnePaymentStrategy implements PaymentStrategy {
  private readonly logger = new Logger(BCELOnePaymentStrategy.name);

  constructor(private readonly httpService: HttpService) {}

  async processPayment(params: {
    amount: number;
    orderId: number;
    bcelAccount?: string; // Laos'ta BCEL hesabı tanımlayacak parametre
  }): Promise<{
    status: 'SUCCESS' | 'FAIL';
    transactionId?: string;
    errorMessage?: string;
  }> {
    try {
      const BCEL_API_URL = 'https://api.bcel.com.la/one/pay'; // hayalî endpoint

      const requestBody = {
        token: process.env.BCEL_API_TOKEN,
        orderId: params.orderId,
        amount: params.amount,
        bcelAccount: params.bcelAccount,
      };

      const response = await this.httpService.axiosRef.post(BCEL_API_URL, requestBody);

      // Hayali cevap: { resultCode: 0, txId: 'BCEL-999999' }
      if (response.data.resultCode === 0) {
        return {
          status: 'SUCCESS',
          transactionId: response.data.txId,
        };
      } else {
        return {
          status: 'FAIL',
          errorMessage: response.data.errorDescription || 'BCEL payment error',
        };
      }
    } catch (error) {
      this.logger.error(`BCEL Payment Error: ${error.message}`, error.stack);
      return {
        status: 'FAIL',
        errorMessage: 'Exception during BCEL payment process',
      };
    }
  }

  async refundPayment?(transactionId: string, amount: number): Promise<boolean> {
    try {
      const BCEL_REFUND_URL = 'https://api.bcel.com.la/one/refund'; // hayalî endpoint

      const requestBody = {
        token: process.env.BCEL_API_TOKEN,
        transactionId,
        amount,
      };

      const response = await this.httpService.axiosRef.post(BCEL_REFUND_URL, requestBody);

      // Örnek: { success: true }
      return response.data.success === true;
    } catch (error) {
      this.logger.error(`BCEL Refund Error: ${error.message}`, error.stack);
      return false;
    }
  }
}
