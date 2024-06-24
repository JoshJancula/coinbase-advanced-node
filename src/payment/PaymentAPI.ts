import {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, UUID_V4} from '../payload';

export interface PaymentMethod {
  allow_buy: boolean;
  allow_deposit: boolean;
  allow_sell: boolean;
  allow_withdraw: boolean;
  created_at: ISO_8601_MS_UTC;
  currency: string;
  id: UUID_V4;
  name: string;
  type: string;
  updated_at: ISO_8601_MS_UTC;
  verified: boolean;
}

export class PaymentAPI {
  static readonly URL = {
    PAYMENTS: `/brokerage/payment_methods`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * List Payment Methods.
   * Get a list of payment methods for the current user.
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethods
   */
  async listPaymentMethods(): Promise<PaymentMethod[]> {
    const resource = PaymentAPI.URL.PAYMENTS;
    const response = await this.apiClient.get(resource);
    return response.data.payment_methods;
  }

  /**
   * Get Payment Method
   * @param id - Payment method ID
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethod
   */
  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    const resource = `${PaymentAPI.URL.PAYMENTS}/${id}`;
    const response = await this.apiClient.get(resource);
    return response.data.payment_method;
  }
}
