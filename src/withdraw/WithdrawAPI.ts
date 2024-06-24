import {AxiosInstance} from 'axios';
import {
  BasicTransactionInformation,
  ISO_8601_MS_UTC,
  NewFiatTransaction,
  PaginatedData,
  Pagination,
  ResourceRef,
  TransactionAmount,
  TransactionStatus,
} from '../payload';
import {SharedRequestService} from '../util/shared-request';

export enum PaymenMethodTypes {
  /** Regular US bank account */
  ACH_BANK_ACCOUNT = 'ach_bank_account',
  /** Bank wire (US only) */
  BANK_WIRE = 'bank_wire',
  /** Credit card (can't be used for buying/selling) */
  CREDIT_CARD = 'credit_card',
  /**  Canadian EFT bank account */
  EFT_BANK_ACCOUNT = 'eft_bank_account',
  /** Fiat nominated Coinbase account */
  FIAT_ACCOUNT = 'fiat_account',
  /** iDeal bank account (Europe) */
  IDEAL_BANK_ACCOUNT = 'ideal_bank_account',
  /** Interac Online for Canadian bank accounts */
  INTERAC = 'interac',
  /** Secure3D verified payment card */
  SECURE_3D_CARD = 'secure3d_card',
  /** European SEPA bank account */
  SEPA_BANK_ACCOUNT = 'sepa_bank_account',
}

export interface PaymentMethodWithdrawalRequest {
  accountId: string;
  amount: string;
  commit?: boolean;
  currency: string;
  payment_method: string;
}

export interface WithdrawalFeeEstimate {
  fee: string;
}

export interface PaymentMethodLimit {
  period_in_days: number;
  remaining: {
    amount: string;
    currency: string;
  };
  total: {
    amount: string;
    currency: string;
  };
}

export interface WithdrawalInformation extends BasicTransactionInformation {
  amount: TransactionAmount;
  committed: boolean;
  created_at: ISO_8601_MS_UTC;
  fee: TransactionAmount;
  id: string;
  payment_method: ResourceRef;
  payout_at: ISO_8601_MS_UTC;
  resource: string;
  resource_path: string;
  status: TransactionStatus;
  subtotal: TransactionAmount;
  transaction: ResourceRef;
  updated_at: ISO_8601_MS_UTC;
}

/**
 * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-payment-methods#payment-method-resource
 */
export interface PaymentMethod {
  allow_buy: boolean;
  allow_deposit: boolean;
  allow_sell: boolean;
  allow_withdraw: boolean;
  created_at: ISO_8601_MS_UTC;
  currency: string;
  fiat_account: ResourceRef;
  id: string;
  instant_buy: boolean;
  instant_sell: boolean;
  limits: {
    buy: PaymentMethodLimit[];
    deposit: PaymentMethodLimit[];
    instant_buy: PaymentMethodLimit[];
    sell: PaymentMethodLimit[];
  };
  name: string;
  primary_buy: false;
  primary_sell: false;
  resource: string;
  resource_path: string;
  type: PaymenMethodTypes;
  updated_at: ISO_8601_MS_UTC;
}

export class WithdrawAPI {
  static readonly URL = {
    LIST_PAYMENT_METHODS: '/payment-methods',
    WITHDRAWALS: {
      PAYMENT_METHOD: '/acounts',
    },
  };

  static readonly SHARED_REF = 'withdrawals';

  private sharedService: SharedRequestService;

  constructor(private readonly apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, WithdrawAPI.SHARED_REF);
  }

  /**
   * Get a list of withdrawals of an account.
   * Withdrawals are only listed for fiat accounts and wallets.
   * To list withdrawals associated with a crypto account/wallet, use List Transactions.
   *
   * @param account - account id the deposit was to
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#list-withdrawals
   */
  async listWithdrawals(account: string, pagination?: Pagination): Promise<PaginatedData<WithdrawalInformation>> {
    return this.sharedService.queryAll<WithdrawalInformation>(account, pagination);
  }

  /**
   * Get information on a single withdrawal.
   *
   * @param accountId - id of the account
   * @param withdrawalId - id of the requested resource
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#show-a-withdrawal
   */
  async getWithdrawal(accountId: string, withdrawalId: string): Promise<WithdrawalInformation> {
    return this.sharedService.getById<WithdrawalInformation>(accountId, withdrawalId);
  }

  /**
   * Withdraw funds to a payment method.
   *
   * @param amount - The amount to withdraw
   * @param currency - The type of currency
   * @param paymentMethodId - ID of the payment method
   * @param accountId - The account to withdraw from
   * @param commit - Commit this transaction (default is true)
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#withdraw-funds
   */
  async withdrawToPaymentMethod(
    amount: string,
    currency: string,
    paymentMethodId: string,
    accountId: string,
    commit: boolean = true
  ): Promise<WithdrawalInformation> {
    const withdrawal: NewFiatTransaction = {
      accountId,
      amount,
      commit,
      currency,
      payment_method: paymentMethodId,
    };
    return this.sharedService.createNew<WithdrawalInformation>(withdrawal);
  }

  /**
   * Completes a withdrawal that is created in commit: false state.
   *
   * @param accountId - The account withdrawal is pulling from
   * @param withdrawalId - The id of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#commit-a-withdrawal
   */
  async commitWithdrawal(accountId: string, withdrawalId: string): Promise<WithdrawalInformation> {
    return this.sharedService.commitPending<WithdrawalInformation>(accountId, withdrawalId);
  }

  /**
   * Get a list of your payment methods.
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-payment-methods#http-request
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const resource = WithdrawAPI.URL.LIST_PAYMENT_METHODS;
    const response = await this.apiClient.get(resource);
    return response.data.data;
  }
}
