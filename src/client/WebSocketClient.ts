import {EventEmitter} from 'events';
import ReconnectingWebSocket, {Event, ErrorEvent, Options, CloseEvent} from 'reconnecting-websocket';
import WebSocket from 'ws';
import {
  Candle,
  CandleBucketUtil,
  CandleGranularityNumbers,
  ISO_8601_MS_UTC,
  OrderSide,
  OrderStatus,
  OrderType,
  RESTClient,
} from '..';
import {RequestSetup, SignedRequest} from '../auth/RequestSigner';

export interface WebSocketChannel {
  channel: WebSocketChannelName;
  product_ids?: string[];
}

export interface WebsocketResponseData {
  channel: WebSocketChannelName;
  client_id: string;
  events?:
    | WebSocketStatusMessageEvent[]
    | WebSocketTickerMessageEvent[]
    | WebSocketL2MessageEvent[]
    | WebsocketMarketTradesMessageEvent[]
    | WebsocketHeartBeatMessageEvent[]
    | WebsocketUserMessageEvent[]
    | WebsocketCandlesMessageEvent[]
    | WebSocketSubscriptionEvent[];
  sequence_num: number;
  timestamp: ISO_8601_MS_UTC;
}

export enum WebSocketChannelName {
  /** Subscribe to the candles channel to receive candles messages for specific products with updates every second. Candles are grouped into buckets (granularities) of five minutes. */
  CANDLES = 'candles',
  /** Real-time server pings to keep all connections open */
  HEARTBEAT = 'heartbeats',
  /** The easiest way to keep a snapshot of the order book is to use the level2 channel. It guarantees delivery of all updates, which reduce a lot of the overhead required when consuming the full channel. */
  LEVEL2 = 'level2',
  /** The market_trades channel sends market trades for a specified product on a preset interval. */
  MARKET_TRADES = 'market_trades',
  /** The status channel will send all products and currencies on a preset interval. */
  STATUS = 'status',
  /** The ticker channel provides real-time price updates every time a match happens. It batches updates in case of cascading matches, greatly reducing bandwidth requirements. */
  TICKER = 'ticker',
  /** A special version of the ticker channel that only provides a ticker update about every 5 seconds. */
  TICKER_BATCH = 'ticker_batch',
  /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
  USER = 'user',
}

export interface WebSocketRequest extends WebSocketChannel {
  // channels: WebSocketChannel[] | string[];
  type: WebSocketRequestType;
}

export enum WebSocketRequestType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
}

export enum WebSocketResponseType {
  /** When candles message */
  CANDLES = 'candles',
  /** Most failure cases will cause an error message (a message with the type "error") to be emitted. */
  ERROR = 'error',
  /** Subscribing to the heartbeats channel, alongside other channels, ensures that all subscriptions stay open when updates are sparse. This is useful, for example, when fetching market data for illiquid pairs. */
  HEARTBEAT = 'heartbeats',
  /** When subscribing to the 'level2' channel it will send an initial snapshot message with the corresponding product ids, bids and asks to represent the entire order book. */
  LEVEL2 = 'l2_data',
  /** is of the type snapshot or update, and contains an array of market trades. Each market trade belongs to a side, which can be of type BUY, or SELL */
  MARKET_TRADES = 'market_trades',
  /** The status channel will send all products and currencies on a preset interval. */
  STATUS = 'status',
  /** Once a subscribe or unsubscribe message is received, the server will respond with a subscriptions message that lists all channels you are subscribed to. */
  SUBSCRIPTIONS = 'subscriptions',
  /** The ticker channel provides real-time price updates every time a match happens. */
  TICKER = 'ticker',
  /** The user channel sends updates on all of a user's open orders, including all subsequent updates of those orders. */
  USER = 'user',
}

export type WebSocketResponse = WebSocketMessage & {type: WebSocketResponseType};

// Not exported because it will become "WebSocketResponse" once complete
type WebSocketMessage =
  | Record<string, string | number | boolean>
  | WebSocketStatusMessage
  | WebSocketTickerMessage
  | WebSocketErrorMessage
  | WebsocketUserMessage
  | WebsocketResponseData
  | WebSocketL2Message
  | WebsocketCandlesMessage
  | WebsocketMarketTradesMessage;

export interface WebSocketErrorMessage {
  message: string;
  reason: string;
  type: WebSocketResponseType.ERROR;
}

export enum MessageEventType {
  SNAPSHOT = 'snapshot',
  UPDATE = 'update',
}

export interface WebsocketProductStatus {
  base_currency: string;
  base_increment: string;
  display_name: string;
  id: string;
  min_market_funds: string;
  product_type: string;
  quote_currency: string;
  quote_increment: string;
  status: string;
  status_message: string;
}

export interface WebSocketStatusMessageEvent {
  products: WebsocketProductStatus[];
  type: MessageEventType;
}

export interface WebSocketStatusMessage extends WebsocketResponseData {
  events: WebSocketStatusMessageEvent[];
  type: WebSocketResponseType.STATUS;
}

export interface WebsocketTicker {
  high_24_h: string;
  high_52_w: string;
  low_24_h: string;
  low_52_w: string;
  price: string;
  price_percent_chg_24_h: string;
  product_id: string;
  type: string;
  volume_24_h: string;
}

export interface WebSocketTickerMessageEvent {
  tickers: WebsocketTicker[];
  type: MessageEventType;
}

export interface WebSocketTickerMessage extends WebsocketResponseData {
  events: WebSocketTickerMessageEvent[];
  type: WebSocketResponseType.TICKER;
}

export interface WebsocketMarketTrade {
  price: string;
  product_id: string;
  side: OrderSide;
  size: string;
  time: ISO_8601_MS_UTC;
  trade_id: string;
}

export enum WebSocketL2OrderSide {
  BID = 'bid',
  OFFER = 'offer',
}

export interface WebSocketL2UpdateInfo {
  event_time: ISO_8601_MS_UTC;
  new_quantity: string;
  price_level: string;
  side: WebSocketL2OrderSide;
}

export interface WebSocketL2MessageEvent {
  product_id: string;
  type: MessageEventType;
  updates: WebSocketL2UpdateInfo[];
}

export interface WebSocketL2Message extends WebsocketResponseData {
  events: WebSocketL2MessageEvent[];
  type: WebSocketResponseType.LEVEL2;
}

export interface WebSocketSubscriptionEvent {
  subscriptions: Record<WebSocketResponseType, string[]>;
}

export interface WebSocketSubscription extends WebsocketResponseData {
  channels: WebSocketChannel[];
  events: WebSocketSubscriptionEvent[];
  type: WebSocketResponseType.SUBSCRIPTIONS;
}

export interface WebsocketMarketTradesMessageEvent {
  trades: WebsocketMarketTrade[];
  type: MessageEventType;
}

export interface WebsocketMarketTradesMessage extends WebsocketResponseData {
  events: WebsocketMarketTradesMessageEvent[];
  type: WebSocketResponseType.MARKET_TRADES;
}

export interface WebsocketCandlesMessageEvent {
  candles: Candle[];
  type: MessageEventType;
}

export interface WebsocketCandlesMessage extends WebsocketResponseData {
  events: WebsocketCandlesMessageEvent[];
  type: WebSocketResponseType.CANDLES;
}

export interface WebsocketUserOrder {
  avg_price: string;
  client_order_id: string;
  creation_time: ISO_8601_MS_UTC;
  cumulative_quantity: string;
  leaves_quantity: string;
  limit_price: string;
  order_id: string;
  order_side: OrderSide;
  order_type: OrderType;
  product_id: string;
  status: OrderStatus;
  stop_price: string;
  total_fees: string;
}

export interface WebsocketUserMessageEvent {
  orders: WebsocketUserOrder[];
  type: MessageEventType;
}

export interface WebsocketUserMessage extends WebsocketResponseData {
  events: WebsocketUserMessageEvent[];
  type: WebSocketResponseType.USER;
}

export interface WebsocketHeartBeatMessageEvent {
  current_time: ISO_8601_MS_UTC;
  heartbeat_counter: string;
}

export interface WebsocketHeartbeatMessage extends WebsocketResponseData {
  events: WebsocketHeartBeatMessageEvent[];
  type: WebSocketResponseType.HEARTBEAT;
}

export enum WebSocketEvent {
  ON_CLOSE = 'WebSocketEvent.ON_CLOSE',
  ON_ERROR = 'WebSocketEvent.ON_ERROR',
  ON_MESSAGE = 'WebSocketEvent.ON_MESSAGE',
  ON_MESSAGE_CANDLES = 'WebSocketEvent.ON_MESSAGE_CANDLES',
  ON_MESSAGE_ERROR = 'WebSocketEvent.ON_MESSAGE_ERROR',
  ON_MESSAGE_HEARTBEAT = 'WebSocketEvent.ON_MESSAGE_HEARTBEAT',
  ON_MESSAGE_LEVEL2 = 'WebSocketEvent.ON_MESSAGE_LEVEL2',
  ON_MESSAGE_MARKET_TRADES = 'WebSocketEvent.ON_MESSAGE_MARKET_TRADES',
  ON_MESSAGE_STATUS = 'WebSocketEvent.ON_MESSAGE_STATUS',
  ON_MESSAGE_TICKER = 'WebSocketEvent.ON_MESSAGE_TICKER',
  ON_OPEN = 'WebSocketEvent.ON_OPEN',
  ON_SUBSCRIPTION_UPDATE = 'WebSocketEvent.ON_SUBSCRIPTION_UPDATE',
  ON_USER_UPDATE = 'WebSocketEvent.ON_USER_UPDATE',
}

export interface WebSocketClient {
  on(event: WebSocketEvent.ON_CLOSE, listener: (event: CloseEvent) => void): this;

  on(event: WebSocketEvent.ON_ERROR, listener: (event: ErrorEvent) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE, listener: (response: WebSocketResponse) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_ERROR, listener: (errorMessage: WebSocketErrorMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_CANDLES, listener: (candleMessage: WebsocketCandlesMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_HEARTBEAT, listener: (heartbeatMessage: WebsocketHeartbeatMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_STATUS, listener: (statusMessage: WebSocketStatusMessage) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_TICKER, listener: (tickerMessage: WebSocketTickerMessage) => void): this;

  on(event: WebSocketEvent.ON_SUBSCRIPTION_UPDATE, listener: (subscriptions: WebSocketSubscription) => void): this;

  on(event: WebSocketEvent.ON_MESSAGE_LEVEL2, listener: (l2update: WebSocketL2Message) => void): this;

  on(
    event: WebSocketEvent.ON_MESSAGE_MARKET_TRADES,
    listener: (marketTrades: WebsocketMarketTradesMessage) => void
  ): this;

  on(event: WebSocketEvent.ON_USER_UPDATE, listener: (userMessage: WebsocketUserMessage) => void): this;

  on(event: WebSocketEvent.ON_OPEN, listener: (event: Event) => void): this;
}

// eslint-disable-next-line no-redeclare
export class WebSocketClient extends EventEmitter {
  static CLOSE_EVENT_CODE = {
    GOING_AWAY: 1001,
    NORMAL_CLOSURE: 1000,
    PROTOCOL_ERROR: 1002,
    UNSUPPORTED_DATA: 1003,
  };

  private readonly baseURL: string;
  public socket: ReconnectingWebSocket | undefined;

  private pingInterval?: NodeJS.Timeout;
  private pongTimeout?: NodeJS.Timeout;

  private pingTime: number;
  private readonly pongTime: number;
  private userID: string | undefined;

  constructor(
    baseURL: string,
    private readonly signRequest: (setup: RequestSetup) => Promise<SignedRequest>,
    private readonly restClient: RESTClient
  ) {
    super();
    this.baseURL = baseURL;
    this.pingTime = 10_000;
    this.pongTime = this.pingTime * 1.5;
  }

  /**
   * The websocket feed is publicly available, but connections to it are rate-limited to 1 per 4 seconds per IP.
   *
   * @param reconnectOptions - Reconnect options to be used with the "reconnecting-websocket" package. Note: Options
   *   will be merged with sensible default values.
   * @see https://docs.cloud.coinbase.com/exchange/docs/websocket-overview
   */
  connect(reconnectOptions?: Options): ReconnectingWebSocket {
    if (this.socket) {
      throw Error(
        `You established already a WebSocket connection. Please call "disconnect" first before creating a new one.`
      );
    }

    const options = this.mergeOptions(reconnectOptions);
    this.socket = new ReconnectingWebSocket(this.baseURL, [], options);

    this.socket.onclose = (event: CloseEvent): void => {
      this.cleanupListener();
      this.emit(WebSocketEvent.ON_CLOSE, event);
    };

    this.socket.onerror = (event: ErrorEvent): void => {
      this.cleanupListener();
      this.emit(WebSocketEvent.ON_ERROR, event);
    };

    this.socket.onmessage = (event: MessageEvent): void => {
      const data: WebSocketResponse = JSON.parse(event.data);

      const target: WebSocketResponseType | WebSocketChannelName | unknown =
        (data as WebsocketResponseData)?.channel || (data as WebSocketResponse)?.type;

      switch (target) {
        case WebSocketResponseType.ERROR:
          data.type = WebSocketResponseType.ERROR;
          this.emit(WebSocketEvent.ON_MESSAGE_ERROR, data);
          break;
        case WebSocketChannelName.STATUS:
          data.type = WebSocketResponseType.STATUS;
          this.emit(WebSocketEvent.ON_MESSAGE_STATUS, data);
          break;
        case WebSocketChannelName.CANDLES:
          (data as WebsocketCandlesMessage).events.forEach(e => {
            e.candles = e.candles
              .sort((a, b) => (a as any).start - (b as any).start)
              .map(c => CandleBucketUtil.mapCandle(c, CandleGranularityNumbers.FIVE_MINUTE, (c as any).product_id));
          });
          data.type = WebSocketResponseType.CANDLES;
          this.emit(WebSocketEvent.ON_MESSAGE_CANDLES, data);
          break;
        case WebSocketChannelName.HEARTBEAT:
          data.type = WebSocketResponseType.HEARTBEAT;
          this.emit(WebSocketEvent.ON_MESSAGE_HEARTBEAT, data);
          break;
        case WebSocketResponseType.SUBSCRIPTIONS:
          data.type = WebSocketResponseType.SUBSCRIPTIONS;
          if (!(data as WebSocketSubscription).channels) {
            (data as WebSocketSubscription).channels = Object.keys(
              (data as WebSocketSubscription).events[0].subscriptions
            ).map(k => {
              const x: WebSocketChannel = {
                channel: k as WebSocketChannelName,
              };
              if (!k.includes(WebSocketChannelName.USER)) {
                x['product_ids'] = (data as any).events[0].subscriptions[k];
              }
              return x;
            });
          }
          this.emit(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, data);
          break;
        case WebSocketChannelName.TICKER:
        case WebSocketChannelName.TICKER_BATCH:
          data.type = WebSocketResponseType.TICKER;
          this.emit(WebSocketEvent.ON_MESSAGE_TICKER, data);
          break;
        case WebSocketChannelName.LEVEL2:
        case WebSocketResponseType.LEVEL2:
          (data as WebSocketL2Message).channel = WebSocketChannelName.LEVEL2;
          data.type = WebSocketResponseType.LEVEL2;
          this.emit(WebSocketEvent.ON_MESSAGE_LEVEL2, data);
          break;
        case WebSocketChannelName.MARKET_TRADES:
          data.type = WebSocketResponseType.MARKET_TRADES;
          this.emit(WebSocketEvent.ON_MESSAGE_MARKET_TRADES, data);
          break;
        case WebSocketChannelName.USER:
          data.type = WebSocketResponseType.USER;
          this.emit(WebSocketEvent.ON_USER_UPDATE, data);
          break;
      }

      // Emit generic event
      this.emit(WebSocketEvent.ON_MESSAGE, data);
    };

    this.socket.onopen = (): void => {
      this.emit(WebSocketEvent.ON_OPEN);
      /**
       * The 'ws' package for Node.js exposes a "ping" function, but the WebSocket API in browsers doesn't. Since
       * "coinbase-advanced-node" can run in both environments (Node.js & web browsers), we have to check for the existence
       * of "ping".
       *
       * Unfortunately, the "real" WebSocket connection isn't exposed from the "reconnecting-websocket" package:
       * https://github.com/pladaria/reconnecting-websocket/pull/148
       */
      const realWebSocket = this.socket?.['_ws'];
      const hasPingSupport = realWebSocket && typeof realWebSocket.ping === 'function';
      this.setupHeartbeat(hasPingSupport, realWebSocket);
    };

    return this.socket;
  }

  disconnect(reason: string = 'Unknown reason'): void {
    if (this.socket) {
      this.socket.close(WebSocketClient.CLOSE_EVENT_CODE.NORMAL_CLOSURE, reason);
      this.socket = undefined;
    }
  }

  /**
   * A simple function to determine if the websocket appears to be open.
   *
   * @returns True if the websocket has been opened and has not closed.
   */
  get connected(): boolean {
    return undefined !== this.socket;
  }

  async sendMessage(message: WebSocketRequest): Promise<void> {
    /**
     * You gotta auth for user
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels
     */
    const signature = await this.signRequest({
      httpMethod: '',
      payload: (message.product_ids || []).join(','),
      requestPath: message.channel,
      ws: true,
    });

    if (!signature.jwt) {
      if (message.channel === WebSocketChannelName.USER) {
        if (!this.userID && signature.key) {
          const user = await this.restClient.user.fetchUserInfo().catch(() => {
            return null;
          });
          this.userID = user?.id;
        }
        Object.assign(signature, {user_id: this.userID});
      }

      // i really don't like that REST needs int and WS needs string
      (signature as any).timestamp = signature.timestamp.toString();
      if (signature?.key) {
        Object.assign(signature, {
          api_key: signature.key.toString(),
        });
        delete (signature as any).key;
        if (signature.oauth) {
          delete (signature as any).signature;
        }
      }
      Object.assign(message, signature);
    } else {
      Object.assign(message, {
        jwt: signature.key,
        timestamp: signature.timestamp,
      });
    }

    if (!this.socket) {
      throw new Error(`Failed to send message of type "${message.type}": You need to connect to the WebSocket first.`);
    }

    this.socket.send(JSON.stringify(message));
  }

  async subscribe(channel: WebSocketChannel | WebSocketChannel[]): Promise<void> {
    const targets = Array.isArray(channel) ? channel : [channel];
    const proms = targets.map((t: WebSocketChannel) =>
      this.sendMessage({...t, ...{type: WebSocketRequestType.SUBSCRIBE}})
    );
    await Promise.allSettled(proms);
  }

  async unsubscribe(channel: WebSocketChannelName | WebSocketChannel | WebSocketChannel[]): Promise<void> {
    const targets = this.mapChannels(channel);
    const proms = targets.map((t: WebSocketChannel) =>
      this.sendMessage({...t, ...{type: WebSocketRequestType.UNSUBSCRIBE}})
    );
    await Promise.allSettled(proms);
  }

  private cleanupListener(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
    }
  }

  private heartbeat(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
    }

    /**
     * Enforce reconnect when not receiving any 'pong' from Coinbase Pro in time.
     * @see https://github.com/bennycode/coinbase-advanced-node/issues/374
     */
    this.pongTimeout = setTimeout(this.onPongTimeout.bind(this), this.pongTime);
  }

  private onPongTimeout(): void {
    this.socket?.reconnect();
  }

  /**
   * Setup a heartbeat with ping/pong interval to avoid broken WebSocket connections:
   * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
   */
  private setupHeartbeat(hasPingSupport: boolean, webSocket: WebSocket): void {
    if (hasPingSupport) {
      // Subscribe to pongs
      webSocket.on('pong', this.heartbeat.bind(this));

      // Send pings
      this.pingInterval = setInterval(() => {
        webSocket.ping(() => {});
      }, this.pingTime) as unknown as NodeJS.Timeout;
    }
  }

  private mergeOptions(reconnectOptions?: Options): Options {
    const defaultOptions: Options = {
      WebSocket,
      connectionTimeout: 2000,
      debug: false,
      maxReconnectionDelay: 4000,
      maxRetries: Infinity,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1,
    };

    return {...defaultOptions, ...reconnectOptions};
  }

  private mapChannels(input: WebSocketChannelName | WebSocketChannel | WebSocketChannel[]): WebSocketChannel[] {
    if (Array.isArray(input)) {
      return input;
    } else if (typeof input === 'string') {
      return [
        {
          channel: input,
          product_ids: [],
        },
      ];
    }
    return [input];
  }
}
