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

export interface BuyInformation extends BasicTransactionInformation {
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

export class BuyAPI {
  static readonly URL = {
    Buys: `/accounts`,
  };
  static readonly SHARED_REF = 'buys';

  private sharedService: SharedRequestService;

  constructor(apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, BuyAPI.SHARED_REF);
  }

  /**
   * Lists buys for an account.
   *
   * @param account - account id of the purchase
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-buys#list-buys
   */
  async listBuys(account: string, pagination?: Pagination): Promise<PaginatedData<BuyInformation>> {
    return this.sharedService.queryAll<BuyInformation>(account, pagination);
  }

  /**
   * Show a buy
   *
   * @param accountId - id of the account
   * @param buyId - id of the requested resource
   * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getBuy
   */
  async getBuy(accountId: string, buyId: string): Promise<BuyInformation> {
    return this.sharedService.getById<BuyInformation>(accountId, buyId);
  }

  /**
   * Place buy order
   *
   * @param data - Information for this buy
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-buys#place-buy-order
   */
  async createBuy(data: SIWCOrder): Promise<BuyInformation> {
    return this.sharedService.createNew<BuyInformation>(data);
  }

  /**
   * Completes a buy order that is created in commit: false state.
   *
   * @param accountId - The account withdrawal is pulling from
   * @param buyId - The id of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-buys#commit-a-buy
   */
  async commitBuy(accountId: string, buyId: string): Promise<BuyInformation> {
    return this.sharedService.commitPending<BuyInformation>(accountId, buyId);
  }
}
