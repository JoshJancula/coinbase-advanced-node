import {AxiosInstance} from 'axios';
import {Balance, UserWarning} from '../payload';

export interface CreateConvertQuotePayload {
  amount: string;
  from_account: string;
  to_account: string;
  trade_incentive_metadata?: {
    code_val: string;
    user_incentive_id: string;
  };
}

export enum ConversionTradeStatus {
  TRADE_STATUS_CANCELED = 'TRADE_STATUS_CANCELED',
  TRADE_STATUS_COMPLETED = 'TRADE_STATUS_COMPLETED',
  TRADE_STATUS_CREATED = 'TRADE_STATUS_CREATED',
  TRADE_STATUS_STARTED = 'TRADE_STATUS_STARTED',
  TRADE_STATUS_UNSPECIFIED = 'TRADE_STATUS_UNSPECIFIED',
}

export enum LedgerAccountTypes {
  INVESTMENT_VEHICLE = 'INVESTMENT_VEHICLE',
  PORTFOLIO = 'PORTFOLIO',
  RETAIL = 'RETAIL',
  UNKNOWN = 'UNKNOWN',
  VENUE = 'VENUE',
}

export enum ConversionTradeSources {
  LEDGER_NAMED_ACCOUNT = 'LEDGER_NAMED_ACCOUNT',
}

export interface ConversionFee {
  amount: Balance;
  description: string;
  disclosure: {
    description: string;
    link: {
      text: string;
      url: string;
    };
    title: string;
  };
  label: string;
  title: string;
}

export interface ConversionTradeLedgerAccount {
  account_id: string;
  currency: string;
  owner: {
    id: string;
    type: LedgerAccountTypes;
    user_uuid: string;
    uuid: string;
  };
}

export interface ConversionTrade {
  amount: Balance;
  cancellation_reason?: {
    code: string;
    error_code: string;
    error_cta: string;
    message: string;
  };
  exchange_rate: Balance;
  fees: ConversionFee[];
  fiat_denoted_total: Balance;
  id: string;
  source: {
    ledger_account: ConversionTradeLedgerAccount;
    network: string;
    type: ConversionTradeSources;
  };
  source_currency: string;
  source_id: string;
  status: ConversionTradeStatus;
  subtotal: Balance;
  target: {
    ledger_account: ConversionTradeLedgerAccount;
    network: string;
    type: ConversionTradeSources;
  };
  target_currency: string;
  target_id: string;
  tax_details: Balance[];
  total: Balance;
  total_fee: ConversionFee;
  total_fee_without_tax: ConversionFee;
  trade_incentive_info: {
    applied_incentive: boolean;
    code_val: string;
    ends_at: string;
    fee_without_incentive: Balance;
    redeemed: boolean;
    user_incentive_id: string;
  };
  unit_price: {
    source_to_fiat: {
      amount: Balance;
      scale: number;
    };
    target_to_fiat: {
      amount: Balance;
      scale: number;
    };
    target_to_source: {
      amount: Balance;
      scale: number;
    };
  };
  user_entered_amount: Balance;
  user_reference: string;
  user_warnings?: UserWarning[];
}

export class ConvertAPI {
  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Create a convert quote with a specified source currency, target currency, and amount.
   * Trades are valid for 10 minutes after the quote is created.
   *
   * @param data - payload for creating the quote
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_createconvertquote
   */
  async createQuote(data: CreateConvertQuotePayload): Promise<ConversionTrade> {
    const resource = `/brokerage/convert/quote`;
    const response = await this.apiClient.post(resource, data);
    return response.data.trade;
  }

  /**
   * Commits a convert trade with a specified trade ID, source currency, and target currency.
   *
   * @param tradeId - The ID of the trade to commit
   * @param data - Object containing the currency of the account to convert to / from, e.g. USD => USDC
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_commitconverttrade
   */
  async commitConvertTrade(
    tradeId: string,
    data: {from_account: string; to_account: string}
  ): Promise<ConversionTrade> {
    const resource = `/brokerage/convert/trade/${tradeId}`;
    const response = await this.apiClient.post(resource, data);
    return response.data.trade;
  }

  /**
   * Gets a list of information about a convert trade with a specified trade ID, source currency, and target currency.
   *
   * @param tradeId - The ID of the trade to commit
   * @param data - Object containing the currency of the account to convert to / from, e.g. USD => USDC
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getconverttrade
   */
  async getConvertTrade(
    tradeId: string,
    queryParams?: {from_account?: string; to_account?: string}
  ): Promise<ConversionTrade> {
    const resource = `/brokerage/convert/trade/${tradeId}`;
    const qp = queryParams || {};
    const response = await this.apiClient.get(resource, {params: {...qp}});
    return response.data.trade;
  }
}
