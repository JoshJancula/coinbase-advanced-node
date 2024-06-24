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
} from '../payload/common';
import {SharedRequestService} from '../util/shared-request';

export interface DepositInformation extends BasicTransactionInformation {
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

export class DepositAPI {
  static readonly URL = {
    DepositS: `/accounts`,
  };
  static readonly SHARED_REF = 'deposits';

  private sharedService: SharedRequestService;

  constructor(apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, DepositAPI.SHARED_REF);
  }

  /**
   * Get a list of deposits from the profile of the API key, in descending order by created time.
   * Deposits are only listed for fiat accounts and wallets. To list deposits associated with a crypto account/wallet, use List Transactions.
   *
   * @param account - account id the deposit was to
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-deposits
   */
  async getDeposits(account: string, pagination?: Pagination): Promise<PaginatedData<DepositInformation>> {
    return this.sharedService.queryAll<DepositInformation>(account, pagination);
  }

  /**
   * Get information on a single deposit.
   *
   * @param accountId - id of the account
   * @param depositId - id of the requested resource
   * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getDeposit
   */
  async getDeposit(accountId: string, depositId: string): Promise<DepositInformation> {
    return this.sharedService.getById<DepositInformation>(accountId, depositId);
  }

  /**
   * Deposit funds to a payment method.
   *
   * @param data - Information for this deposit
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-deposits#deposit-funds
   */
  async depositFunds(data: NewFiatTransaction): Promise<DepositInformation> {
    return this.sharedService.createNew<DepositInformation>(data);
  }

  /**
   * Completes a deposit that is created with commit: false state.
   *
   * @param accountId - The account withdrawal is pulling from
   * @param depositId - The id of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-deposits#commit-a-deposit
   */
  async commitDeposit(accountId: string, depositId: string): Promise<DepositInformation> {
    return this.sharedService.commitPending<DepositInformation>(accountId, depositId);
  }
}
