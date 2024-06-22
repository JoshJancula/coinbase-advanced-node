import {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, OrderSide, PaginatedData, Pagination, UUID_V4} from '../payload/common';
import {formatPaginationIntoParams} from '../util/shared-request';

export enum Liquidity {
  MAKER = 'M',
  TAKER = 'T',
}

export enum LiquidityIndicatorTypes {
  MAKER = 'MAKER',
  TAKER = 'TAKER',
  UNKNOWN_LIQUIDITY_INDICATOR = 'UNKNOWN_LIQUIDITY_INDICATOR',
}

export enum FillTradeType {
  CORRECTION = 'CORRECTION',
  FILL = 'FILL',
  REVERSAL = 'REVERSAL',
  SYNTHETIC = 'SYNTHETIC',
}

export interface Fill {
  commission: string;
  entry_id: string;
  liquidity_indicator: LiquidityIndicatorTypes;
  order_id: UUID_V4;
  price: string;
  product_id: string;
  sequence_timestamp: ISO_8601_MS_UTC;
  side: OrderSide;
  size: string;
  size_in_quote: boolean;
  trade_id: string;
  trade_time: ISO_8601_MS_UTC;
  trade_type: FillTradeType;
  user_id: string;
}

export interface FillApiQueryParams {
  cursor?: string; // Cursor used for pagination. When provided, the response returns responses after this cursor
  end_sequence_timestamp?: ISO_8601_MS_UTC; // End date. Only fills with a trade time before this start date are returned.
  limit?: number; // Maximum number of fills to return in response. Defaults to 100.
  order_id?: string;
  product_id?: string;
  start_sequence_timestamp?: ISO_8601_MS_UTC;
}

export class FillAPI {
  static readonly URL = {
    FILLS: `/brokerage/orders/historical/fills`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Get a list of recent fills for a given Order of the API key.
   *
   * @param orderId - ID of previously placed order
   * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
   */
  async getFillsByOrderId(
    orderId: string,
    queryParams?: FillApiQueryParams | Pagination
  ): Promise<PaginatedData<Fill>> {
    if (queryParams && ((queryParams as Pagination).before || (queryParams as Pagination).after)) {
      queryParams = formatPaginationIntoParams(queryParams);
    }
    Object.assign(queryParams || {}, {order_id: orderId});
    return this.getFills(queryParams as FillApiQueryParams);
  }

  /**
   * Get a list of recent fills for a given Product of the API key
   *
   * @param productId - Representation for base and counter
   * @param queryParams - Pagination instance provides legacy cb-pro interface, use FillApiQueryParams for additional options
   */
  async getFillsByProductId(
    productId: string,
    queryParams?: FillApiQueryParams | Pagination
  ): Promise<PaginatedData<Fill>> {
    if (queryParams && ((queryParams as Pagination).before || (queryParams as Pagination).after)) {
      queryParams = formatPaginationIntoParams(queryParams);
    }
    Object.assign(queryParams || {}, {product_id: productId});
    return this.getFills(queryParams as FillApiQueryParams);
  }

  /**
   * Get a list of recent fills associated to the API key
   *
   * @param query - query to filter results
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfills
   */
  async getFills(query: FillApiQueryParams): Promise<PaginatedData<Fill>> {
    const resource = FillAPI.URL.FILLS;
    const response = await this.apiClient.get(resource, {params: query});
    const position =
      response.data.cursor && response.data.cursor !== '' ? response.data.cursor : response.data.fills.length;
    return {
      data: response.data.fills,
      pagination: {
        after: (Number(position) - response.data.fills.length).toString(),
        before: position.toString(),
        has_next: response.data.has_next || false,
      },
    };
  }
}
