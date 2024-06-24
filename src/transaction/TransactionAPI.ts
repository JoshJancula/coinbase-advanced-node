import {AxiosInstance} from 'axios';
import {PaginatedData, Pagination, TransactionInformation, TransactionType} from '../payload/common';
import {SharedRequestService} from '../util/shared-request';

type BasicNewTransaction = {
  amount: string;
  currency: string;
  description?: string;
  /** A blockchain address, or an email of the recipient */
  to: string;
};

export interface InternalTransfer extends BasicNewTransaction {
  type: TransactionType.TRANSFER;
}

export interface OutboundTransaction extends BasicNewTransaction {
  /** The website of the financial institution or exchange. Required if to_financial_institution is true */
  financial_institution_website?: string;
  /** [Recommended] A token to ensure idempotence. If a previous transaction with the same idem parameter exists for this sender,
   *  that previous transaction is returned and a new one is not created. Max length is 100 characters. */
  idem?: string;
  skip_notifications?: boolean;
  to_financial_institution?: boolean;
  type: TransactionType.SEND;
}

export type NewTransaction = InternalTransfer | OutboundTransaction;

export class TransactionAPI {
  private sharedService: SharedRequestService;
  static readonly SHARED_REF = 'transactions';

  constructor(private readonly apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, TransactionAPI.SHARED_REF);
  }

  /**
   * Lists the transactions of an account by account ID.
   *
   * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-transactions#list-transactions
   */
  async listTransactions(accountID: string, params?: Pagination): Promise<PaginatedData<TransactionInformation>> {
    return this.sharedService.queryAll<TransactionInformation>(accountID, params);
  }

  /**
   * Get information on a single transaction.
   *
   * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
   * @param transactionId - id of the requested resource
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-transactions#show-a-transaction
   */
  async getTransaction(accountID: string, transactionId: string): Promise<TransactionInformation> {
    return this.sharedService.getById<TransactionInformation>(accountID, transactionId);
  }

  /**
   * Send Transaction
   *
   * @param accountID - account you're sending $ out of
   * @param info - information of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-transactions#http-request-2
   */
  async sendTransaction(accountID: string, info: NewTransaction): Promise<TransactionInformation> {
    const resource = `/accounts/${accountID}/transactions`;
    const response = await this.apiClient.post(resource, info);
    return response.data.data;
  }

  /**
   * Transfer any Coinbase supported digital asset between two of a single user's accounts. The following transfers are allowed:
   *
   * @param accountID - account you're sending $ out of
   * @param info - information of the transaction
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-transactions#transfer-money-between-accounts
   */
  async transferFunds(accountID: string, info: InternalTransfer): Promise<TransactionInformation> {
    const resource = `/accounts/${accountID}/transactions`;
    const response = await this.apiClient.post(resource, info);
    return response.data.data;
  }
}
