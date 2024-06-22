import {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, PaginatedData, Pagination, TransactionInformation} from '../payload/common';
import {SharedRequestService} from '../util/shared-request';

export interface AddressResource {
  address: string;
  created_at: ISO_8601_MS_UTC;
  id: string;
  name: string;
  network: string;
  resource: string;
  resource_path: string;
  updated_at: ISO_8601_MS_UTC;
}

export class AddressAPI {
  static readonly URL = {
    Address: `/brokerage/Addresss`,
    COINBASE_Address: `/Addresss`,
  };
  static readonly SHARED_REF = 'addresses';

  private sharedService: SharedRequestService;

  constructor(private readonly apiClient: AxiosInstance) {
    this.sharedService = new SharedRequestService(apiClient, AddressAPI.SHARED_REF);
  }

  /**
   * Lists addresses for an account. An address can only be associated with one account.
   *
   * @param account - account id the address is linked to
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-addresses
   */
  async listAddresses(account: string, pagination?: Pagination): Promise<PaginatedData<AddressResource>> {
    return this.sharedService.queryAll<AddressResource>(account, pagination);
  }

  /**
   * Get an single address for an account. A regular cryptocurrency address...
   * can be used in place of addressId but the address must be associated with the correct account.
   *
   * @param accountId - id of the account
   * @param addressId - id of the requested resource
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-addresses#http-request-1
   */
  async getAddress(accountId: string, depositId: string): Promise<AddressResource> {
    return this.sharedService.getById<AddressResource>(accountId, depositId);
  }

  /**
   * List transactions that have been sent to a specific address. A regular cryptocurrency address
   * can be used in place of addressId but the address must be associated with the correct account.
   *
   * @param accountId - address id the address is linked to
   * @param addressId - id of the requested resource
   * @param pagination - Pagination field
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-transactions
   */
  async getAddressTransactions(
    accountId: string,
    addressId: string,
    pagination?: Pagination
  ): Promise<PaginatedData<TransactionInformation>> {
    return this.sharedService.queryAll<TransactionInformation>(
      accountId,
      pagination,
      `/accounts/${accountId}/addresses/${addressId}/transactions`
    );
  }

  /**
   * Creates a new address for an account. Addresses can be created for wallet account types.
   *
   * @param accountId - the accounts id
   * @param name - a name for this address
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-addresses#create-address
   */
  async createAddress(accountId: string, name?: string): Promise<AddressResource> {
    const resource = `accounts/${accountId}/addresses`;
    const response = await this.apiClient.post(resource, name ? {name} : {});
    return response.data.data;
  }
}
