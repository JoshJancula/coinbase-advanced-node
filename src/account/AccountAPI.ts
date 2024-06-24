import {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, PaginatedData, Pagination} from '../payload/common';
import {formatPaginationFromResponse, formatPaginationIntoParams} from '../util/shared-request';

export interface SIWCAvailableBalance {
  amount: string;
  currency: string;
}

export interface AvailableBalance {
  currency: string;
  value: string;
}

export interface AccountHold extends AvailableBalance {}

export enum AdvanceAccountTypes {
  ACCOUNT_TYPE_CRYPTO = 'ACCOUNT_TYPE_CRYPTO',
  ACCOUNT_TYPE_FIAT = 'ACCOUNT_TYPE_FIAT',
  ACCOUNT_TYPE_UNSPECIFIED = 'ACCOUNT_TYPE_UNSPECIFIED',
  ACCOUNT_TYPE_VAULT = 'ACCOUNT_TYPE_VAULT',
}

export interface Account {
  active: boolean;
  available_balance: AvailableBalance;
  created_at: ISO_8601_MS_UTC;
  currency: string;
  default: boolean;
  deleted_at: ISO_8601_MS_UTC;
  hold: AccountHold;
  name: string;
  ready: boolean;
  retail_portfolio_id?: string;
  type: AdvanceAccountTypes;
  updated_at: ISO_8601_MS_UTC;
  uuid: string;
}

export enum CoinbaseAccountType {
  FIAT = 'fiat',
  VAULT = 'vault',
  WALLET = 'wallet',
}

export interface CoinbaseCurrencyDetails {
  address_regex: string;
  asset_id: string;
  code: string;
  color: string;
  destination_tag_name: string;
  destination_tag_regex: string;
  exponent: number;
  name: string;
  slug: string;
  sort_index: number;
  type: CoinbaseAccountType;
}

export interface CoinbaseRewardDetails {
  apy: string;
  formatted_apy: string;
  label: string;
}

export interface CoinbaseAccount {
  allow_deposits: boolean;
  allow_withdrawals: boolean;
  balance: SIWCAvailableBalance;
  created_at: ISO_8601_MS_UTC;
  currency: CoinbaseCurrencyDetails;
  id: string;
  name: string;
  primary: boolean;
  resource: string;
  resource_path: string;
  rewards: CoinbaseRewardDetails;
  type: CoinbaseAccountType;
  updated_at: ISO_8601_MS_UTC;
}

export interface AddressInfo {
  address: string;
  destination_tag?: string;
}

export class AccountAPI {
  static readonly URL = {
    ACCOUNTS: `/brokerage/accounts`,
    COINBASE_ACCOUNT: `/accounts`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Get information for a single account.
   *
   * @param accountId - Account ID is the Account.uuid
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount
   */
  async getAccount(accountId: string): Promise<Account> {
    const resource = `${AccountAPI.URL.ACCOUNTS}/${accountId}`;
    const response = await this.apiClient.get(resource);
    return response.data.account;
  }

  /**
   * Get information for a single account. API key must belong to the same profile as the account.
   *
   * @param accountId - Account ID is either Account.uuid || Account.currency || CoinbaseAccoount.currency.code
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-accounts/#show-account
   */
  async getCoinbaseAccount(accountId: string): Promise<CoinbaseAccount> {
    const resource = `${AccountAPI.URL.COINBASE_ACCOUNT}/${accountId}`;
    const response = await this.apiClient.get(resource);
    return response.data.data;
  }

  /**
   * Get a list of trading accounts from the profile of the API key.
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts
   */
  async listAccounts(pagination?: Pagination): Promise<PaginatedData<Account>> {
    const resource = AccountAPI.URL.ACCOUNTS;
    if (pagination) {
      pagination = formatPaginationIntoParams(pagination);
    }
    const response = await this.apiClient.get(resource, {params: {limit: 250, ...pagination}});
    return {
      data: response.data.accounts,
      pagination: formatPaginationFromResponse(response),
    };
  }

  /**
   * Get a list of your coinbase accounts.
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-accounts/#list-accounts
   */
  async listCoinbaseAccounts(pagination?: Pagination): Promise<PaginatedData<CoinbaseAccount>> {
    const resource = AccountAPI.URL.COINBASE_ACCOUNT;
    if (pagination) {
      pagination = formatPaginationIntoParams(pagination, true);
    }
    const response = await this.apiClient.get(resource, {params: {limit: 250, ...pagination}});
    return {
      data: response.data.data,
      pagination: formatPaginationFromResponse(response),
    };
  }
}
