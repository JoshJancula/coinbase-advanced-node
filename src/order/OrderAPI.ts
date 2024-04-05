import {AxiosError, AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC, OrderSide, PaginatedData} from '../payload';

export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
  UNKNOWN_ORDER_TYPE = 'UNKNOWN_ORDER_TYPE',
}

export enum TimeInForce {
  FILL_OR_KILL = 'FILL_OR_KILL',
  GOOD_UNTIL_CANCELLED = 'GOOD_UNTIL_CANCELLED',
  GOOD_UNTIL_DATE_TIME = 'GOOD_UNTIL_DATE_TIME',
  IMMEDIATE_OR_CANCEL = 'IMMEDIATE_OR_CANCEL',
  UNKNOWN_TIME_IN_FORCE = 'UNKNOWN_TIME_IN_FORCE',
}

export enum OrderStatus {
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  FILLED = 'FILLED',
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  UNKNOWN_ORDER_STATUS = 'UNKNOWN_ORDER_STATUS',
}

export enum TriggerStatus {
  INVALID_ORDER_TYPE = 'INVALID_ORDER_TYPE',
  STOP_PENDING = 'STOP_PENDING',
  STOP_TRIGGERED = 'STOP_TRIGGERED',
  UNKNOWN_TRIGGER_STATUS = 'UNKNOWN_TRIGGER_STATUS',
}

export enum StopDirection {
  STOP_DIRECTION_STOP_DOWN = 'STOP_DIRECTION_STOP_DOWN',
  STOP_DIRECTION_STOP_UP = 'STOP_DIRECTION_STOP_UP',
  UNKNOWN_STOP_DIRECTION = 'UNKNOWN_STOP_DIRECTION',
}

export interface LimitOrderGTC {
  limit_limit_gtc: {
    base_size: string;
    limit_price: string;
    post_only: boolean;
  };
}

export interface LimitOrderGTD {
  limit_limit_gtd: {
    base_size: string;
    end_time: ISO_8601_MS_UTC;
    limit_price: string;
    post_only: boolean;
  };
}

export interface StopOrderGTC {
  stop_limit_stop_limit_gtc: {
    base_size: string;
    limit_price: string;
    stop_direction: StopDirection;
    stop_price: string;
  };
}

export interface StopOrderGTD {
  stop_limit_stop_limit_gtd: {
    base_size: string;
    end_time: ISO_8601_MS_UTC;
    limit_price: string;
    stop_direction: StopDirection;
    stop_price: string;
  };
}

export interface MarketOrder {
  market_market_ioc: {
    base_size?: string; // Amount of base currency to spend on order. Required for SELL orders.
    quote_size?: string; // Amount of quote currency to spend on order. Required for BUY orders.
  };
}

/**  (Smart Order Routing) Limit IOC (Immediate Or Cancel) */
export interface LimitOrderIOC {
  sor_limit_ioc: {
    limit_price: string;
    quote_size: string;
  };
}

export type OrderConfiguration =
  | MarketOrder
  | LimitOrderGTC
  | LimitOrderGTD
  | StopOrderGTC
  | StopOrderGTD
  | LimitOrderIOC;

export interface NewOrder {
  client_order_id: string;
  leverage?: string;
  margin_type?: OrderMarginTypes;
  order_configuration: OrderConfiguration;
  product_id: string;
  retail_portfolio_id?: string;
  self_trade_prevention_id?: string;
  side: OrderSide;
}

export enum OrderMarginTypes {
  CROSS = 'CROSS',
  ISOLATED = 'ISOLATED',
}
export interface PreviewOrderPayload {
  commission_rate: {
    value: string;
  };
  is_max: boolean;
  leverage: string;
  margin_type: OrderMarginTypes;
  order_configuration: OrderConfiguration;
  side: OrderSide;
  skip_fcm_risk_check: boolean;
  tradable_balance: string;
}

export enum CancelOrderFailureReasons {
  COMMANDER_REJECTED_CANCEL_ORDER = 'COMMANDER_REJECTED_CANCEL_ORDER',
  DUPLICATE_CANCEL_REQUEST = 'DUPLICATE_CANCEL_REQUEST',
  INVALID_CANCEL_REQUEST = 'INVALID_CANCEL_REQUEST',
  UNKNOWN_CANCEL_FAILURE_REASON = 'UNKNOWN_CANCEL_FAILURE_REASON',
  UNKNOWN_CANCEL_ORDER = 'UNKNOWN_CANCEL_ORDER',
}

export interface CancelOrderResponse {
  failure_reason?: CancelOrderFailureReasons;
  order_id: string;
  success?: boolean;
}

/** @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders */
export interface OrderListQueryParam {
  asset_filters?: string[];
  contract_expiry_type?: string;
  end_date?: ISO_8601_MS_UTC;
  limit?: number;
  order_placement_source?: string;
  order_side?: OrderSide;
  /** Limit list of orders to these statuses. Passing "all" returns orders of all statuses. Default: [open, pending, active] */
  order_status?: (OrderStatus | 'all')[];
  order_type?: OrderType;
  /** Only list orders for a specific product. */
  product_id?: string;
  product_type?: string;
  retail_portfolio_id?: string;
  start_date?: ISO_8601_MS_UTC;
  user_native_currency?: string;
}
export interface Order {
  average_filled_price: string;
  cancel_message: string;
  client_order_id: string;
  completion_percentage: string;
  created_time: ISO_8601_MS_UTC;
  fee: string;
  filled_size: string;
  filled_value: string;
  id(id: any): unknown;
  number_of_fills: string;
  order_configuration: OrderConfiguration;
  order_id: string;
  order_type: OrderType;
  pending_cancel: boolean;
  product_id: string;
  product_type: string;
  reject_message: string;
  reject_reason: string;
  settled: boolean;
  side: OrderSide;
  size_in_quote: boolean;
  size_inclusive_of_fees: boolean;
  status: OrderStatus;
  time_in_force: TimeInForce;
  total_fees: string;
  total_value_after_fees: string;
  trigger_status: TriggerStatus;
  user_id: string;
}

export interface CreateOrderResponse {
  error_response?: {
    error: string;
    error_details: string;
    message: string;
    new_order_failure_reason: string;
    preview_failure_reason: string;
  };
  failure_reason?: string;
  order_configuration?: OrderConfiguration;
  order_id: string;
  success: boolean;
  success_response?: {
    client_order_id: string;
    order_id: string;
    product_id: string;
    side: OrderSide;
  };
}

export interface EditOrderPaylod {
  order_id: string;
  price: string;
  size: string;
}

export interface PreviewOrderResponse {
  base_size: string;
  best_ask: string;
  best_bid: string;
  commission_total: string;
  errs: string[];
  is_max: boolean;
  leverage: string;
  long_leverage: string;
  order_margin_total: string;
  order_total: string;
  quote_size: string;
  short_leverage: string;
  slippage: string;
  warning: string[];
}

export interface ClosePositionParams {
  /** A unique ID provided by the client for their own identification purposes. This ID differs from the order_id generated for the order. If the ID provided is not unique, the order fails to be created and the order corresponding to that ID is returned. */
  client_order_id: string;
  /** The product this order was created for */
  product_id: string;
  /** Number of contracts a user wants to close for a position */
  size?: string;
}

export interface ClosePositionResponse {
  error_response?: {
    error: string;
    error_details: string;
    message: string;
    new_order_failure_reason: string;
    preview_failure_reason: string;
  };
  order_configuration?: OrderConfiguration;
  success: boolean;
  success_response: {
    client_order_id: string;
    order_id: string;
    product_id: string;
    side: OrderSide;
  };
}

export class OrderAPI {
  static readonly URL = {
    ORDERS: `/brokerage/orders`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Cancel these orders
   *
   * @param orderIds - Representation for base and counter
   * @returns A list of ids of the canceled orders
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_cancelorders
   */
  async cancelOpenOrders(orderIds?: string | string[]): Promise<CancelOrderResponse[]> {
    const resource = OrderAPI.URL.ORDERS + '/batch_cancel';
    const response = await this.apiClient.post(resource, {
      order_ids: Array.isArray(orderIds) ? orderIds : [orderIds],
    });
    return response.data.results;
  }

  /**
   * Cancel a previously placed order. Order must belong to the profile that the API key belongs to.
   *
   * @param orderId - ID of the order to cancel
   * @param productId - deprecated
   * @returns The ID of the canceled order
   * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_deleteorder
   */
  async cancelOrder(orderId: string, _productId?: string): Promise<CancelOrderResponse> {
    const x = await this.cancelOpenOrders(orderId);
    return x[0];
  }

  /**
   * Close Position
   * Places an order to close any open positions for a specified product_id.
   *
   * @param data - ClosePositionParams
   * @returns ClosePositionResponse
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_closeposition
   */
  async closePosition(data: ClosePositionParams): Promise<ClosePositionResponse> {
    const resource = OrderAPI.URL.ORDERS + '/close_position';
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }

  /**
   * List your orders from the profile that the API key belongs to. Only open or un-settled orders are returned. As
   * soon as an order is no longer open and settled, it will no longer appear in the default request.
   *
   * @note Depending on your activity, fetching all data from this endpoint can take very long (measured already 25
   *   seconds!)
   * @param query - Available query parameters (Pagination, Product ID and/or Order Status)
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorders
   */
  async getOrders(query?: OrderListQueryParam): Promise<PaginatedData<Order>> {
    const resource = OrderAPI.URL.ORDERS + '/historical/batch';
    if (!query) {
      query = {};
    }
    if (!query?.limit) {
      query.limit = 25;
    }
    const response = await this.apiClient.get(`${resource}`, {
      params: query,
    });
    const position =
      response.data.cursor && response.data.cursor !== '' ? response.data.cursor : response.data.orders.length;
    return {
      data: response.data.orders,
      pagination: {
        after: (Number(position) - response.data.orders.length).toString(),
        before: position.toString(),
        has_next: response.data.has_next || false,
      },
    };
  }

  /**
   * Get a single order by order id from the profile that the API key belongs to.
   *
   * @param orderId - ID of previously placed order
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_gethistoricalorder
   */
  async getOrder(orderId: string): Promise<Order | null> {
    const resource = `${OrderAPI.URL.ORDERS}/historical/${orderId}`;
    try {
      const response = await this.apiClient.get(resource);
      const order = response?.data?.order || response?.data?.data || response.data;
      return order;
    } catch (error) {
      /**
       * If the order is canceled the response may
       * have status code 404 if the order had no matches.
       */
      if ((error as AxiosError).response!.status === 404) {
        return null;
      }

      throw error;
    }
  }

  /**
   * You can place two types of orders: limit and market. Orders can only be placed if your account has sufficient
   * funds. Once an order is placed, your account funds will be put on hold for the duration of the order.
   *
   * @param newOrder - Order type and parameters
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_postorder
   */
  async placeOrder(newOrder: NewOrder): Promise<CreateOrderResponse> {
    const resource = OrderAPI.URL.ORDERS;
    const response = await this.apiClient.post<CreateOrderResponse>(resource, newOrder);
    return response.data;
  }

  /**
   * Edit an order's size (quantity), or price. Only good-till-cancelled (GTC) Limit Orders can be edited.
   *
   * @param data - updates fo the order
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_editorder
   */
  async editOrder(data: EditOrderPaylod): Promise<{errors?: any; success: boolean}> {
    const resource = OrderAPI.URL.ORDERS + '/edit';
    const response = await this.apiClient.post<{errors?: any; success: boolean}>(resource, data);
    return response.data;
  }

  /**
   * Simulate an edit order request with a specified new size, or new price, to preview the result of an edit.
   * Only limit order types, with time in force type of good-till-cancelled can be edited.
   *
   * @param data - updates fo the order
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_previeweditorder
   */
  async editOrderPreview(data: EditOrderPaylod): Promise<{errors?: any; success: boolean}> {
    const resource = OrderAPI.URL.ORDERS + '/edit_preview';
    const response = await this.apiClient.post<{errors?: any; success: boolean}>(resource, data);
    return response.data;
  }

  /**
   * Preview the results of an order request before sending.
   *
   * @param data - order info
   * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_previeworder
   */
  async previewOrder(data: PreviewOrderPayload): Promise<PreviewOrderResponse> {
    const resource = OrderAPI.URL.ORDERS + '/preview';
    const response = await this.apiClient.post<PreviewOrderResponse>(resource, data);
    return response.data;
  }
}
