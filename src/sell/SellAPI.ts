import {AxiosInstance} from 'axios';
import {
  BasicTransactionInformation,
  ISO_8601_MS_UTC,
  PaginatedData,
  Pagination,
  ResourceRef,
  SIWCOrder,
  TransactionAmount,
  TransactionStatus,
} from '../payload/common';
import {SharedRequestService} from '../util/shared-request';

export interface SellInformation extends BasicTransactionInformation {
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

export class SellAPI {
  static readonly URL = {
    Sells: `/accounts`,
  };
  static readonly SHARED_REF = 'sells';

  private sharedService: SharedRequestService;

  constructor(apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, SellAPI.SHARED_REF);
  }

  /**
   * Lists sells for an account.
   *
   * @param account - account id of the purchase
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-sells#list-sells
   */
  async listSells(account: string, pagination?: Pagination): Promise<PaginatedData<SellInformation>> {
    return this.sharedService.queryAll<SellInformation>(account, pagination);
  }

  /**
   * Show a sell
   *
   * @param accountId - id of the account
   * @param sellId - id of the requested resource
   * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getSell
   */
  async getSell(accountId: string, sellId: string): Promise<SellInformation> {
    return this.sharedService.getById<SellInformation>(accountId, sellId);
  }

  /**
   * Place sell order
   *
   * @param data - Information for this sell
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-sells#place-sell-order
   */
  async createSell(data: SIWCOrder): Promise<SellInformation> {
    return this.sharedService.createNew<SellInformation>(data);
  }

  /**
   * Completes a sell order that is created in commit: false state.
   *
   * @param accountId - The account withdrawal is pulling from
   * @param sellId - The id of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-sells#commit-a-sell
   */
  async commitSell(accountId: string, sellId: string): Promise<SellInformation> {
    return this.sharedService.commitPending<SellInformation>(accountId, sellId);
  }
}
