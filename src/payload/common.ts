/** ISO 8601 timestamp with microseconds in Coordinated Universal Time (UTC), i.e. "2014-11-06T10:34:47.123456Z" */
export type ISO_8601_MS_UTC = string;
export type UNIX_STAMP = number;

/** UUID, both forms (with and without dashes) are accepted, i.e. "132fb6ae-456b-4654-b4e0-d681ac05cea1" or "132fb6ae456b4654b4e0d681ac05cea1" */
export type UUID_V4 = string;

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  UNKNOWN_ORDER_SIDE = 'UNKNOWN_ORDER_SIDE',
}

export enum TransactionStatus {
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed',
  PENDING = 'pending',
  WAITING_FOR_CLEARING = 'waiting_for_clearing',
  WAITING_FOR_SIGNATURE = 'waiting_for_signature',
}

/** @see https://docs.cloud.coinbase.com/exchange/docs/pagination */
export interface Pagination {
  /** Request page after (older) this pagination id. */
  after?: string;
  /** Request page before (newer) this pagination id. */
  before?: string;
  /** Number of results per request. Maximum 100. Default 100. */
  limit?: number;
}

export interface PaginatedData<PayloadType> {
  data: PayloadType[];
  pagination: {after?: string; before?: string; has_next?: boolean};
}

/** I'm not fond of how coinbase flips between this Amount & Balance schema but it is what it is */
export interface Amount {
  amount: string;
  currency: string;
}

export interface Balance {
  currency: string;
  value: string;
}

export interface TransactionAmount extends Amount {}

export interface OrderAmount {
  price: string;
  size: string;
}

export interface ResourceRef {
  currency?: string;
  id: string;
  resource: string;
  resource_path: string;
}

export interface BasicTransactionInformation {
  amount: TransactionAmount;
  created_at: ISO_8601_MS_UTC;
  id: string;
  resource: string;
  resource_path: string;
  status: TransactionStatus;
  updated_at: ISO_8601_MS_UTC;
}

export interface NewFiatTransaction {
  /** The accountId to send funds from */
  accountId: string;
  amount: string;
  commit?: boolean;
  currency: string;
  payment_method: string;
}

export interface SIWCOrder {
  /** The accountId to place the order must be the id associated with the cryptocurrency. */
  accountId: string;
  /** Whether or not you would still like to buy if you have to wait for your money to arrive to lock in a price  */
  agree_btc_amount_varies: boolean;
  /** Buy amount without fees */
  amount: string;
  /** If false, this buy will not be immediately completed. Use the commit call to complete it. Default value: true */
  commit?: boolean;
  /** Currency for the amount */
  currency: string;
  /** ID of the payment method that should be used for the buy */
  payment_method?: string;
  /** If true, the response returns an unsave buy for detailed price quote. Default value: false */
  quote?: boolean;
  /** Buy amount with fees (alternative to amount) */
  total?: string;
}

export type NewSIWCTransaction = SIWCOrder | NewFiatTransaction;

export enum TransactionNetworkType {
  CONFIRMED = 'confirmed',
  OFF_BLOCKCHAIN = 'off_blockchain',
  PENDING = 'pending',
  UNCONFIRMED = 'unconfirmed',
}

export interface AdvanceTradeFill {
  commission: string;
  fill_price: string;
  order_id: string;
  order_side: OrderSide;
  product_id: string;
}

export interface TransactionNetwork {
  name: string;
  status: TransactionNetworkType;
}

export interface TransactionInformation extends BasicTransactionInformation {
  address?: string;
  advanced_trade_fill: AdvanceTradeFill;
  amount: TransactionAmount;
  buy?: ResourceRef;
  created_at: ISO_8601_MS_UTC;
  description: string;
  details: {
    subtitle: string;
    title: string;
  };
  from?: ResourceRef;
  hide_native_amount?: boolean;
  id: string;
  instant_exchange?: boolean;
  native_amount: TransactionAmount;
  network?: TransactionNetwork;
  resource: string;
  resource_path: string;
  sell?: ResourceRef;
  status: TransactionStatus;
  to?: ResourceRef;
  type: TransactionType;
  updated_at: ISO_8601_MS_UTC;
}

export enum TransactionType {
  /** Fills for an advanced trade order */
  ADVANCED_TRADE_FILL = 'advanced_trade_fill',
  /** Buy a digital asset */
  BUY = 'buy',
  /** Deposit money into Coinbase */
  EXCHANGE_DEPOSIT = 'exchange_deposit',
  /** Withdraw money from Coinbase */
  EXCHANGE_WITHDRAWAL = 'exchange_withdrawal',
  /** Deposit funds into a fiat account from a financial institution */
  FIAT_DEPOSIT = 'fiat_deposit',
  /** Withdraw funds from a fiat account */
  FIAT_WITHDRAWAL = 'fiat_withdrawal',
  /** inflation rewards deposit */
  INFLATION_REWARD = 'inflation_reward',
  /** transfers to/from coinbase pro */
  PRO_DEPOSIT = 'pro_deposit',
  PRO_WITHDRAWAL = 'pro_withdrawal',
  /** Request digital asset from a user or email */
  REQUEST = 'request',
  /** Sell a digital asset */
  SELL = 'sell',
  /** Send a supported digital asset to a corresponding address or email */
  SEND = 'send',
  /** stating reward deposit */
  STAKING_REWARD = 'staking_reward',
  /** traded one currency for another */
  TRADE = 'trade',
  /** Transfer funds between two of one user’s accounts */
  TRANSFER = 'transfer',
  /** Withdraw funds from a vault account */
  VAULT_WITHDRAWAL = 'vault_withdrawal',
}

export interface UserWarning {
  code: string;
  context: {
    details: string[];
    link_text: string;
    title: string;
  };
  id: string;
  link: {
    text: string;
    url: string;
  };
  message: string;
}
