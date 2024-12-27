// src/modules/payment/strategies/payment-strategy.interface.ts

export interface PaymentStrategy {
  /**
   * Ödeme sürecini başlatma veya tamamlayarak
   * transactionId gibi yanıt bilgilerinin geri dönmesi.
   */
  processPayment(params: {
    amount: number;
    orderId: number;
    // Kullanıcı kart bilgileri veya mobil cüzdan bilgileri vs.
    // Bu parametrelerin ne olacağını gerçek sağlayıcı docs’una göre belirlersiniz
  }): Promise<{
    status: 'SUCCESS' | 'FAIL';
    transactionId?: string;
    errorMessage?: string;
  }>;

  /**
   * İade veya iptal senaryoları için isteğe bağlı metod
   */
  refundPayment?(transactionId: string, amount: number): Promise<boolean>;
}
