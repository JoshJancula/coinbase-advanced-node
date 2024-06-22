import {AxiosInstance} from 'axios';

/**
 * Your fee tier is based upon total USD trading volume over the trailing 30 day period.
 *
 * @see https://help.coinbase.com/en/pro/trading-and-funding/trading-rules-and-fees/fees.html
 */
export interface FeeTier {
  /** A maker fee is paid when you create ("make") liquidity on the order book, i.e. you create an order which is not matched immediately. */
  maker_fee_rate: string;
  /**   Pricing tier for user, determined by notional (USD) volume. */
  pricing_tier: string;
  /** A taker fee is paid when you remove ("take") liquidity from the order book, i.e. you create an order which matches an existing order (this includes all market orders). */
  taker_fee_rate: string;
  /** Lower bound (inclusive) of pricing tier in notional volume. */
  usd_from: string;
  /** Upper bound (exclusive) of pricing tier in notional volume. */
  usd_to: string;
}

export enum GoodsAndServicesTypes {
  EXCLUSIVE = 'EXCLUSIVE',
  INCLUSIVE = 'INCLUSIVE',
}

export interface CoinbaseFees {
  advanced_trade_only_fees: number;
  advanced_trade_only_volume: number;
  coinbase_pro_fees: number;
  coinbase_pro_volume: number;
  fee_tier: FeeTier;
  goods_and_services_tax: {
    rate: string;
    type: GoodsAndServicesTypes;
  };
  margin_rate: {
    value: string;
  };
  total_fees: number;
  total_volume: number;
}

export class FeeAPI {
  static readonly URL = {
    FEES: `/brokerage/transaction_summary`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Get your current maker & taker fee rates, as well as your 30-day trailing volume. Quoted rates are subject to
   * change.
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gettransactionsummary
   */
  async getCurrentFees(): Promise<CoinbaseFees> {
    const resource = FeeAPI.URL.FEES;
    const response = await this.apiClient.get<CoinbaseFees>(resource);
    return response.data;
  }
}
