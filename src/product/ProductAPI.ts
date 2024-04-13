/* eslint-disable sort-keys-fix/sort-keys-fix */
import {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, OrderAmount, OrderSide, PaginatedData, Pagination, UNIX_STAMP} from '../payload/common';
import {CandleBucketUtil} from './CandleBucketUtil';
import {RESTClient} from '..';
import {formatPaginationIntoParams} from '../util/shared-request';

export interface Product {
  auction_mode: boolean;
  base_currency_id: string;
  base_increment: string;
  base_max_size: string;
  base_min_size: string;
  base_name: string;
  cancel_only: boolean;
  is_disabled: boolean;
  limit_only: boolean;
  mid_market_price: string;
  new: boolean;
  post_only: boolean;
  price: string;
  price_percentage_change_24h: string;
  product_id: string;
  product_type: string;
  quote_currency_id: string;
  quote_increment: string;
  quote_max_size: string;
  quote_min_size: string;
  quote_name: string;
  status: string;
  trading_disabled: boolean;
  volume_24h: string;
  volume_percentage_change_24h: string;
  watched: boolean;
}

// Snapshot information about the last trade (tick), best bid/ask and 24h volume.
export interface ProductTicker {
  ask: string;
  bid: string;
  price: string;
  size: string;
  time: string;
  trade_id: number;
  volume: string;
}

export interface ProductStats {
  high: string;
  last: string;
  low: string;
  open: string;
  volume: string;
  volume_30day: string;
}

export interface Trade {
  ask: string;
  best_ask: string;
  best_bid: string;
  bid: string;
  price: string;
  product_id: string;
  side: OrderSide;
  size: string;
  time: ISO_8601_MS_UTC;
  trade_id: string;
}

/** Accepted granularity in seconds to group historic rates. */
export enum CandleGranularityNumbers {
  ONE_MINUTE = 60,
  FIVE_MINUTE = 300,
  FIFTEEN_MINUTE = 900,
  ONE_HOUR = 3600,
  SIX_HOUR = 21600,
  ONE_DAY = 86400,
  THIRTY_MINUTE = 1800,
  TWO_HOUR = 7200,
}

export enum CandleGranularity {
  FIFTEEN_MINUTE = 'FIFTEEN_MINUTE',
  FIVE_MINUTE = 'FIVE_MINUTE',
  ONE_DAY = 'ONE_DAY',
  ONE_HOUR = 'ONE_HOUR',
  ONE_MINUTE = 'ONE_MINUTE',
  SIX_HOUR = 'SIX_HOUR',
  THIRTY_MINUTE = 'THIRTY_MINUTE',
  TWO_HOUR = 'TWO_HOUR',
}

export const getNumericCandleGranularity = (key: CandleGranularity): number => {
  return CandleGranularityNumbers[key as keyof typeof CandleGranularityNumbers];
};

export interface BaseHistoricRateRequest {
  /** Desired time slice in seconds. */
  granularity: CandleGranularity;
}

export interface HistoricRateRequestWithTimeSpan extends BaseHistoricRateRequest {
  /** Opening time (ISO 8601) of last candle, i.e. "2020-04-28T23:00:00.000Z" */
  end: ISO_8601_MS_UTC | UNIX_STAMP;
  /** Opening time (ISO 8601) of first candle, i.e. "2020-04-28T00:00:00.000Z" */
  start: ISO_8601_MS_UTC | UNIX_STAMP;
}

export type HistoricRateRequest = BaseHistoricRateRequest | HistoricRateRequestWithTimeSpan;

export interface PriceBook {
  asks: OrderAmount[];
  bids: OrderAmount[];
  product_id: string;
  time: ISO_8601_MS_UTC;
}

type Close = number;
type High = number;
type Low = number;
type Open = number;
type Timestamp = number;
type Volume = number;

export interface Candle {
  /** ID of base asset */
  base: string;
  /** Closing price (last trade) in the bucket interval */
  close: Close;
  /** ID of quote asset */
  counter: string;
  /** Highest price during the bucket interval */
  high: High;
  /** Lowest price during the bucket interval */
  low: Low;
  /** Opening price (first trade) in the bucket interval */
  open: Open;
  /** Bucket start time in simplified extended ISO 8601 format */
  openTimeInISO: ISO_8601_MS_UTC;
  /** Bucket start time converted to milliseconds (note: Coinbase Pro actually uses seconds) */
  openTimeInMillis: number;
  /** Product ID / Symbol */
  productId: string;
  /** Candle size in milliseconds */
  sizeInMillis: number;
  /** Volume of trading activity during the bucket interval */
  volume: Volume;
}

type RawCandle = [Timestamp, Low, High, Open, Close, Volume];

type CandleWatcherConfig = {
  expectedISO: ISO_8601_MS_UTC;
  intervalId: NodeJS.Timeout;
};

export enum ProductEvent {
  NEW_CANDLE = 'ProductEvent.NEW_CANDLE',
}

export interface ProductsQueryParams {
  contract_expiry_type?: string;
  limit?: number;
  offset?: number;
  product_ids?: string[];
  product_type?: string;
}

export interface MarketTradesResponse extends PaginatedData<Trade> {
  best_ask: string;
  best_bid: string;
}

export class ProductAPI {
  static readonly URL = {
    BEST_BID_ASK: `/brokerage/best_bid_ask`,
    PRODUCT_BOOK: `/brokerage/product_book`,
    // eslint-disable-next-line sort-keys
    PRODUCTS: `/brokerage/products`,
  };

  private watchCandlesConfig: Map<string, CandleWatcherConfig> = new Map();

  constructor(private readonly apiClient: AxiosInstance, private readonly restClient: RESTClient) {}

  /**
   * Get historic rates for a product. Rates are returned in grouped buckets (candlesticks) based on requested
   * granularity.
   *
   * Note: The maximum number of data points for a single request is 300 candles. If your selection of start/end time
   * and granularity will result in more than 300 data points, your request will be rejected. If you wish to retrieve
   * fine granularity data over a larger time range, you will need to make multiple requests with new start/end ranges.
   *
   * @param productId - Representation for base and counter
   * @param [params] - Desired timespan
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getcandles
   */
  async getCandles(productId: string, params: HistoricRateRequest): Promise<Candle[]> {
    const resource = `${ProductAPI.URL.PRODUCTS}/${productId}/candles`;

    const candleSizeInMillis = getNumericCandleGranularity(params.granularity) * 1000;
    const potentialParams = params as HistoricRateRequestWithTimeSpan;

    let rawCandles: RawCandle[] = [];

    if (potentialParams.start && potentialParams.end) {
      const fromInMillis =
        typeof potentialParams.start === 'number'
          ? potentialParams.start * 1000
          : new Date(potentialParams.start).getTime();
      const toInMillis =
        typeof potentialParams.end === 'number' ? potentialParams.end * 1000 : new Date(potentialParams.end).getTime();

      const bucketsInMillis = CandleBucketUtil.getBucketsInMillis(fromInMillis, toInMillis, candleSizeInMillis);
      const bucketsInISO = CandleBucketUtil.getBucketsInISO(bucketsInMillis);

      for (let index = 0; index < bucketsInISO.length; index++) {
        const bucket = bucketsInISO[index];
        const response = await this.apiClient.get<any>(resource, {
          params: {
            end: Math.floor(new Date(bucket.stop).getTime() / 1000),
            granularity: params.granularity,
            start: Math.floor(new Date(bucket.start).getTime() / 1000),
          },
        });
        rawCandles.push(...response.data.candles);
      }
    } else {
      if (!potentialParams.end) {
        potentialParams.end = potentialParams.start
          ? Math.floor(new Date(potentialParams.start).getTime() + (candleSizeInMillis * 300) / 1000)
          : Math.floor(Date.now() / 1000);
      }

      if (!potentialParams.start) {
        potentialParams.start = Math.floor(new Date(potentialParams.end).getTime() - (candleSizeInMillis * 300) / 1000);
      }

      const response = await this.apiClient.get<any>(resource, {params: potentialParams});
      const c = response?.data?.candles || [];
      rawCandles = rawCandles.concat([...c]);
    }

    return rawCandles
      .map(candle => CandleBucketUtil.mapCandle(candle, candleSizeInMillis, productId))
      .sort((a, b) => a.openTimeInMillis - b.openTimeInMillis);
  }

  private composeCandleWatcherKey(productId: string, granularity: CandleGranularity): string {
    return `${productId}@${granularity}`;
  }

  getCandleWatcherConfig(productId: string, granularity: CandleGranularity): CandleWatcherConfig {
    const key = this.composeCandleWatcherKey(productId, granularity);
    const config = this.watchCandlesConfig.get(key);
    if (config) {
      return config;
    }
    throw new Error(`There is no candle watching config with key "${key}".`);
  }

  /**
   * Watch a specific product ID for new candles. Candles will be emitted through the `ProductEvent.NEW_CANDLE` event.
   *
   * @param productId - Representation for base and counter
   * @param granularity - Desired candle size
   * @param lastCandleTime - Timestamp (ISO 8601) of last candle received
   * @returns Handle to stop the watch interval
   */
  watchCandles(productId: string, granularity: CandleGranularity, lastCandleTime: ISO_8601_MS_UTC): void {
    const key = this.composeCandleWatcherKey(productId, granularity);

    if (this.watchCandlesConfig.get(key)) {
      throw new Error(
        `You are already watching "${productId}" with an interval of "${granularity}" seconds. Please clear this interval before creating a new one.`
      );
    } else {
      const expectedISO = CandleBucketUtil.addUnitISO(lastCandleTime, granularity, 1);
      const intervalId = this.startCandleInterval(productId, granularity);

      this.watchCandlesConfig.set(key, {
        expectedISO,
        intervalId,
      });
    }
  }

  /**
   * Stop watching a specific candle interval.
   *
   * @param productId - Representation for base and counter
   * @param granularity - Desired candle size
   */
  unwatchCandles(productId: string, granularity: CandleGranularity): void {
    const key = this.composeCandleWatcherKey(productId, granularity);
    const config = this.watchCandlesConfig.get(key);
    if (config) {
      clearInterval(config.intervalId);
      this.watchCandlesConfig.delete(key);
    }
  }

  /**
   * Get trading details for a specified product.
   *
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproduct
   */
  async getProduct(productId: string): Promise<Product | undefined> {
    const resource = `${ProductAPI.URL.PRODUCTS}/${productId}`;
    const response = await this.apiClient.get<Product>(resource);
    return response.data;
  }

  /**
   * Get trading details of all available products.
   *
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproducts
   */
  async getProducts(params?: ProductsQueryParams): Promise<Product[]> {
    const resource = ProductAPI.URL.PRODUCTS;
    const response = await this.apiClient.get(resource, {params: {limit: 999, ...(params || {})}});
    return response.data.products;
  }

  /**
   * Get the latest trades for a product.
   *
   * @param productId - Representation for base and counter
   * @param pagination - Pagination field
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getmarkettrades
   */
  async getTrades(productId: string, pagination?: Pagination): Promise<MarketTradesResponse> {
    const resource = `${ProductAPI.URL.PRODUCTS}/${productId}/ticker`;
    let params: any = {limit: pagination?.limit || 999};
    if (pagination) {
      params = formatPaginationIntoParams(pagination, false, params);
    }
    const response = await this.apiClient.get(resource, {params});
    return {
      best_ask: response.data.best_ask,
      best_bid: response.data.best_bid,
      data: response.data.trades,
      pagination: {
        after: (pagination?.after || 0).toString(),
        before: response.data.num_products,
        has_next: false,
      },
    };
  }

  /**
   * Get latest 24 hours of movement data for a product.
   *
   * @param productId - Representation for base and counter
   * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductstats
   */
  async getProductStats(productId: string): Promise<ProductStats> {
    const dateOffset = 24 * 60 * 1000;
    return this.getCandles(productId, {
      end: Date.now() / 1000,
      granularity: CandleGranularity.ONE_DAY,
      start: Math.floor(Date.now() / 1000 - dateOffset),
    }).then((res: Candle[]) => {
      const latest = res[res.length - 1];
      return {
        high: latest?.high?.toString(),
        last: latest?.close?.toString(),
        low: latest?.low?.toString(),
        open: latest.open.toString(),
        volume: latest?.volume?.toString(),
        volume_30day: 'unknown',
      };
    });
  }

  /**
   * Get Best Bid/Ask
   *
   * @param productIds - Products to get asks/bids for
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getbestbidask
   */
  async getBestAsksAndBids(productIds: string[]): Promise<PriceBook[]> {
    const response = await this.apiClient.get(ProductAPI.URL.BEST_BID_ASK, {
      params: {product_ids: productIds},
    });
    return response.data.pricebooks;
  }

  /**
   * Get Product Book
   *
   * @param productId - Products to get asks/bids for
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getproductbook
   */
  async getProductBook(productId: string, limit?: number): Promise<PriceBook> {
    const params = {limit: limit || 250, product_id: productId};
    const response = await this.apiClient.get(ProductAPI.URL.PRODUCT_BOOK, {params});
    return response.data.pricebook;
  }

  private emitCandle(productId: string, granularity: CandleGranularity, candle: Candle): void {
    const config = this.getCandleWatcherConfig(productId, granularity);
    // Emit matched candle
    this.restClient.emit(ProductEvent.NEW_CANDLE, productId, granularity, candle);
    // Cache timestamp of upcoming candle
    const nextOpenTime = CandleBucketUtil.addUnitISO(candle.openTimeInMillis, granularity, 1);
    config.expectedISO = nextOpenTime;
  }

  private async checkNewCandles(productId: string, granularity: CandleGranularity): Promise<void> {
    const config = this.getCandleWatcherConfig(productId, granularity);
    const expectedTimestampISO = config.expectedISO;

    const candles = await this.getCandles(productId, {
      granularity,
      start: expectedTimestampISO,
    });

    const matches = candles.filter(candle => candle.openTimeInMillis >= new Date(expectedTimestampISO).getTime());
    if (matches.length > 0) {
      const matchedCandle = matches[0];
      this.emitCandle(productId, granularity, matchedCandle);
    }
  }

  private startCandleInterval(productId: string, granularity: CandleGranularity): NodeJS.Timeout {
    // Check for new candles in the smallest candle interval possible, which is 1 minute
    const updateInterval = CandleGranularityNumbers.ONE_MINUTE * 1000;
    return global.setInterval(async () => {
      await this.checkNewCandles(productId, granularity);
    }, updateInterval);
  }
}
