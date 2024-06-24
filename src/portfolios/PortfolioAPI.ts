import {AxiosInstance} from 'axios';
import {Balance} from '../payload';

export enum PortfolioTypes {
  CONSUMER = 'CONSUMER',
  DEFAULT = 'DEFAULT',
  INTX = 'INTX',
}

export enum PositionSide {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum FuturesPositionSide {
  FUTURES_POSITION_SIDE_LONG = 'FUTURES_POSITION_SIDE_LONG',
  FUTURES_POSITION_SIDE_SHORT = 'FUTURES_POSITION_SIDE_SHORT',
  FUTURES_POSITION_SIDE_UNSPECIFIED = 'FUTURES_POSITION_SIDE_UNSPECIFIED',
}

export interface CoinbasePortfolio {
  deleted: boolean;
  name: string;
  type: PortfolioTypes;
  uuid: string;
}

export interface TransferFundsRequest {
  funds: {
    currency: string;
    value: string;
  };
  source_portfolio_uuid: string;
  target_portfolio_uuid: string;
}

export interface FuturesPositionBreakdown {
  amount: string;
  asset_img_url: string;
  avg_entry_price: string;
  contract_size: string;
  current_price: string;
  expiry: string;
  notional_value: string;
  product_id: string;
  product_name: string;
  side: FuturesPositionSide;
  underlying_asset: string;
  unrealized_pnl: string;
  venue: string;
}

export interface FuturesPosition {
  avg_entry_price: string;
  current_price: string;
  daily_realized_pnl: string;
  expiration_time: string;
  number_of_contracts: string;
  product_id: string;
  side: PositionSide;
  unrealized_pnl: string;
}

export interface SpotPosition {
  account_uuid: string;
  allocation: number;
  asset: string;
  asset_img_url: string;
  available_to_trade_fiat: number;
  cost_basis: Balance;
  is_cash: boolean;
  one_day_change: number;
  total_balance_crypto: number;
  total_balance_fiat: number;
}

export interface PortfolioBreakdown {
  futures_positions: FuturesPositionBreakdown[];
  perp_positions: PerpetualsPosition[];
  portfolio: CoinbasePortfolio;
  portfolio_balances: {
    futures_unrealized_pnl: Balance;
    perp_unrealized_pnl: Balance;
    total_balance: Balance;
    total_cash_equivalent_balance: Balance;
    total_crypto_balance: Balance;
    total_futures_balance: Balance;
  };
  spot_positions: SpotPosition[];
}

export enum MarginLevels {
  BASE = 'BASE',
  DANGER = 'DANGER',
  LIQUIDATION = 'LIQUIDATION',
  UNSPECIFIED = 'UNSPECIFIED',
  WARNING = 'WARNING',
}

export interface MarginWindowMeasure {
  futures_buying_power: string;
  initial_margin: string;
  liquidation_buffer: string;
  maintenance_margin: string;
  margin_level: MarginLevels;
  margin_window_type: MarginWindowTypes;
  total_hold: string;
}

export interface FuturesBalanceSummary {
  available_margin: Balance;
  cbi_usd_balance: Balance;
  cfm_usd_balance: Balance;
  daily_realized_pnl: Balance;
  futures_buying_power: Balance;
  initial_margin: Balance;
  intraday_margin_window_measure: MarginWindowMeasure;
  liquidation_buffer_amount: Balance;
  liquidation_buffer_percentage: string;
  liquidation_threshold: Balance;
  overnight_margin_window_measure: MarginWindowMeasure;
  total_open_orders_hold_amount: Balance;
  total_usd_balance: Balance;
  unrealized_pnl: Balance;
}

export enum SweepStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  UNKNOWN_FCM_SWEEP_STATUS = 'UNKNOWN_FCM_SWEEP_STATUS',
}

export interface FuturesSweep {
  id: string;
  requested_amount: Balance;
  scheduled_time: string;
  should_sweep_all: boolean;
  status: SweepStatus;
}

export interface AllocatePortfolioPayload {
  amount: string;
  currency: string;
  portfolio_uuid: string;
  symbol: string;
}

export enum PerpetualsMarginTypes {
  MARGIN_TYPE_CROSS = 'MARGIN_TYPE_CROSS',
  MARGIN_TYPE_ISOLATED = 'MARGIN_TYPE_ISOLATED',
  MARGIN_TYPE_UNSPECIFIED = 'MARGIN_TYPE_UNSPECIFIED',
}

export enum PerpetualsMarginFlagTypes {
  PORTFOLIO_MARGIN_FLAGS_IN_LIQUIDATION = 'PORTFOLIO_MARGIN_FLAGS_IN_LIQUIDATION',
  PORTFOLIO_MARGIN_FLAGS_UNSPECIFIED = 'PORTFOLIO_MARGIN_FLAGS_UNSPECIFIED',
}

export enum PerpetualLiquidationStatusTypes {
  PORTFOLIO_LIQUIDATION_STATUS_AUTO_LIQUIDATING = 'PORTFOLIO_LIQUIDATION_STATUS_AUTO_LIQUIDATING',
  PORTFOLIO_LIQUIDATION_STATUS_CANCELING = 'PORTFOLIO_LIQUIDATION_STATUS_CANCELING',
  PORTFOLIO_LIQUIDATION_STATUS_CUSTOMER_ASSIGNMENT = 'PORTFOLIO_LIQUIDATION_STATUS_CUSTOMER_ASSIGNMENT',
  PORTFOLIO_LIQUIDATION_STATUS_LSP_ASSIGNMENT = 'PORTFOLIO_LIQUIDATION_STATUS_LSP_ASSIGNMENT',
  PORTFOLIO_LIQUIDATION_STATUS_MANUAL = 'PORTFOLIO_LIQUIDATION_STATUS_MANUAL',
  PORTFOLIO_LIQUIDATION_STATUS_NOT_LIQUIDATING = 'PORTFOLIO_LIQUIDATION_STATUS_NOT_LIQUIDATING',
  PORTFOLIO_LIQUIDATION_STATUS_UNSPECIFIED = 'PORTFOLIO_LIQUIDATION_STATUS_UNSPECIFIED',
}

export interface PerpetualsPortfolio {
  accrued_interest: string;
  borrow: string;
  buying_power: Balance;
  collateral: string;
  liquidation_buffer: string;
  liquidation_percentage: string;
  liquidation_status: PerpetualLiquidationStatusTypes;
  margin_flags: PerpetualsMarginFlagTypes;
  margin_type: PerpetualsMarginTypes;
  max_withdrawal: Balance;
  open_position_notional: string;
  pending_fees: string;
  portfolio_im_notional: Balance;
  portfolio_initial_margin: string;
  portfolio_maintenance_margin: string;
  portfolio_mm_notional: Balance;
  portfolio_uuid: string;
  position_notional: string;
  rolling_debt: string;
  total_balance: Balance;
  unrealized_pnl: Balance;
}

export interface PerpetualsPortfolioSummary {
  portfolios: PerpetualsPortfolio[];
  summary: {
    buying_power: Balance;
    max_withdrawal_amount: Balance;
    total_balance: Balance;
    unrealized_pnl: Balance;
  };
}

export interface PortfolioAssetDetails {
  account_collateral_limit: string;
  asset_icon_url: string;
  asset_id: string;
  asset_name: string;
  asset_uuid: string;
  collateral_weight: string;
  ecosystem_collateral_limit_breached: boolean;
  status: string;
  supported_networks_enabled: boolean;
}

export interface PortfolioBalance {
  asset: PortfolioAssetDetails;
  collateral_value: string;
  collateral_weight: string;
  hold: string;
  loan: string;
  loan_collateral_requirement_usd: string;
  max_withdraw_amount: string;
  pledged_quantity: string;
  quantity: string;
  transfer_hold: string;
}

export interface PortfolioBalanceResponse {
  portfolio_balances: {
    balances: PortfolioBalance[];
    is_margin_limit_reached: boolean;
    portfolio_uuid: string;
  };
}

export interface ListPerpetualPositionsResponse {
  positions: PerpetualsPosition[];
  summary: {
    aggregated_pnl: Balance;
  };
}

export interface PerpetualsPosition {
  aggregated_pnl: Balance;
  buy_order_size: string;
  entry_vwap: Balance;
  im_contribution: string;
  im_notional: Balance;
  leverage: string;
  liquidation_buffer: string;
  liquidation_percentage: string;
  liquidation_price: Balance;
  margin_type: PerpetualsMarginTypes;
  mark_price: Balance;
  mm_notional: Balance;
  net_size: string;
  portfolio_summary: PerpetualsPortfolioSummary;
  position_notional: Balance;
  position_side: PositionSide;
  product_id: string;
  product_uuid: string;
  sell_order_size: string;
  symbol: string;
  unrealized_pnl: Balance;
  vwap: Balance;
}

export interface PerpetualPositionBreakdown {
  asset_image_url: string;
  buy_order_size: string;
  im_contribution: string;
  im_notional: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  leverage: string;
  liquidation_buffer: string;
  liquidation_percentage: string;
  liquidation_price: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  margin_type: PerpetualsMarginTypes;
  mark_price: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  mm_notional: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  net_size: string;
  position_notional: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  position_side: FuturesPositionSide;
  product_id: string;
  product_uuid: string;
  sell_order_size: string;
  symbol: string;
  unrealized_pnl: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
  vwap: {
    rawCurrency: Balance;
    userNativeCurrency: Balance;
  };
}

export enum IntradayMarginSettings {
  INTRADAY = 'INTRADAY',
  STANDARD = 'STANDARD',
  UNSPECIFIED = 'UNSPECIFIED',
}

export interface IntradayMarginSettingsPayload {
  intraday_margin_setting: IntradayMarginSettings;
}

export enum MarginWindowTypes {
  INTRADAY = 'INTRADAY',
  OVERNIGHT = 'OVERNIGHT',
  TRANSITION = 'TRANSITION',
  UNSPECIFIED = 'UNSPECIFIED',
  WEEKEND = 'WEEKEND',
}

export interface MarginWindow {
  end_time: string;
  margin_window_type: MarginWindowTypes;
}
export interface CurrentMarginWindowInfo {
  is_intraday_margin_enrollment_killswitch_enabled: boolean;
  is_intraday_margin_killswitch_enabled: boolean;
  margin_window: MarginWindow;
}

export interface SetMultiAssetCollateralPayload {
  multi_asset_collateral_enabled: boolean;
  portfolio_uuid: string;
}

export interface SetMultiAssetCollateralResponse {
  multi_asset_collateral_enabled: boolean;
}

export class PortfolioAPI {
  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * List Portfolios
   * This endpoint requires the "view" permission.
   *
   * @param params - Object containing portfolio_type params, is left as an object that is direct passed so if future params
   * are added the object could be passed as any.
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfolios
   */
  async getPortfolios(params?: {portfolio_type: PortfolioTypes}): Promise<CoinbasePortfolio[]> {
    const resource = `/brokerage/portfolios`;
    const response = await this.apiClient.get(resource, {params});
    return response.data.portfolios;
  }

  /**
   * Create Portfolio
   * This endpoint requires the "trade" permission (for any portfolio).
   *
   * @param name - name for the portfolio
   * are added the object could be passed as any.
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createportfolio
   */
  async createPortfolio(name: string): Promise<CoinbasePortfolio> {
    const resource = `/brokerage/portfolios`;
    const response = await this.apiClient.post(resource, {name});
    return response.data.portfolio;
  }

  /**
   * Move Portfolio Funds
   * This endpoint requires the "transfer" permission (for the source portfolio).
   *
   * @param data - info on the transfer
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds
   */
  async transferFunds(data: TransferFundsRequest): Promise<{
    source_portfolio_uuid: string;
    target_portfolio_uuid: string;
  }> {
    const resource = `/brokerage/portfolios/move_funds`;
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }

  /**
   * Get Portfolio Breakdown
   * This endpoint requires the "view" permission (for that portfolio).
   *
   * @param id - id of the portfolio
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfoliobreakdown
   */
  async getPortfolioBreakdown(id: string): Promise<PortfolioBreakdown> {
    const resource = `/brokerage/portfolios/${id}`;
    const response = await this.apiClient.get(resource);
    return response.data.breakdown;
  }

  /**
   * Delete Portfolio
   * This endpoint requires the "trade" permission (for that portfolio).
   *
   * @param id - id of the portfolio to delete
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_deleteportfolio
   */
  async deletePortfolio(id: string): Promise<{}> {
    const resource = `/brokerage/portfolios/${id}`;
    const response = await this.apiClient.delete(resource);
    return response.data;
  }

  /**
   * Edit Portfolio
   * This endpoint requires the "trade" permission (for that portfolio).
   *
   * @param id - id of the portfolio
   * @param updatePayload -  Object containing updates is unaltered when proxied
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editportfolio
   */
  async editPortfolio(id: string, updatePayload: {name: string}): Promise<CoinbasePortfolio> {
    const resource = `/brokerage/portfolios/${id}`;
    const response = await this.apiClient.put(resource, updatePayload);
    return response.data.portfolio;
  }

  /**
   * Get Futures Balance Summary
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmbalancesummary
   */
  async getFuturesBalanceSummary(): Promise<FuturesBalanceSummary> {
    const resource = `/brokerage/cfm/balance_summary`;
    const response = await this.apiClient.get(resource);
    return response.data.balance_summary;
  }

  /**
   * List Futures Positions
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmpositions
   */
  async listFuturesPositions(): Promise<FuturesPosition[]> {
    const resource = `/brokerage/cfm/positions`;
    const response = await this.apiClient.get(resource);
    return response.data.positions;
  }

  /**
   * Get Futures Position
   *
   * @param id - id of the position
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition
   */
  async getFuturesPosition(id: string): Promise<FuturesPosition> {
    const resource = `/brokerage/cfm/positions/${id}`;
    const response = await this.apiClient.get(resource);
    return response.data.position;
  }

  /**
   * Schedule Futures Sweep
   *
   * @param data - the sweep data
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_schedulefcmsweep
   */
  async scheduleFuturesSweep(data: {usd_amount: string}): Promise<{success: boolean}> {
    const resource = `/brokerage/cfm/sweeps/schedule`;
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }

  /**
   * List Futures Sweeps
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmsweeps
   */
  async listFuturesSweeps(): Promise<FuturesSweep[]> {
    const resource = `/brokerage/cfm/sweeps`;
    const response = await this.apiClient.get(resource);
    return response.data.sweeps;
  }

  /**
   * Cancel Pending Futures Sweep
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelfcmsweep
   */
  async cancelPendingSweep(): Promise<{success: boolean}> {
    const resource = `/brokerage/cfm/sweeps`;
    const response = await this.apiClient.delete(resource);
    return response.data;
  }

  /**
   * Allocate Portfolio
   *
   * @param data - aloocation data
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_allocateportfolio
   */
  async allocatePortfolio(data: AllocatePortfolioPayload): Promise<{}> {
    const resource = `/brokerage/intx/allocate`;
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }

  /**
   * Get Perpetuals Portfolio Summary
   *
   * @param id - The unique identifier for your perpetuals portfolio.
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxportfoliosummary
   */
  async getPerpetualsPortfolioSummary(id: string): Promise<PerpetualsPortfolioSummary> {
    const resource = `/brokerage/intx/portfolio/${id}`;
    const response = await this.apiClient.get(resource);
    return response.data;
  }

  /**
   * List Perpetuals Positions
   *
   * @param id -The unique identifier for your perpetuals portfolio.
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxpositions
   */
  async listPerpetualsPositions(id: string): Promise<ListPerpetualPositionsResponse> {
    const resource = `/brokerage/intx/positions/${id}`;
    const response = await this.apiClient.get(resource);
    return response.data;
  }

  /**
   * Get Perpetuals Position
   *
   * @param id - The unique identifier for your perpetuals portfolio.
   * @param symbol - The product_id for which you want to get the position. e.g. 'BTC-PERP-INTX'
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxposition
   */
  async getPerpetualsPosition(id: string, symbol: string): Promise<PerpetualsPosition> {
    const resource = `/brokerage/intx/positions/${id}/${symbol}`;
    const response = await this.apiClient.get(resource);
    return response.data.position;
  }

  /**
   * Set Intraday Margin Setting
   *
   * @param data - request body see IntradayMarginSettingsPayload
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_setintradaymarginsetting/
   */
  async setIntradayMarginSetting(data: IntradayMarginSettingsPayload): Promise<{}> {
    const resource = `/brokerage/cfm/intraday/margin_setting`;
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }

  /**
   * Get Intraday Margin Setting
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintradaymarginsetting/
   */
  async getIntradayMarginSetting(): Promise<IntradayMarginSettingsPayload> {
    const resource = `/brokerage/cfm/intraday/margin_setting`;
    const response = await this.apiClient.get(resource);
    return response.data;
  }

  /**
   * Get Current Margin Window
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcurrentmarginwindow/
   */
  async getCurrentMarginWindow(): Promise<CurrentMarginWindowInfo> {
    const resource = `brokerage/cfm/intraday/current_margin_window`;
    const response = await this.apiClient.get(resource);
    return response.data;
  }

  /**
   * Get Portfolio Balances
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxbalances/
   */
  async getPortfolioBalance(portfolioId: string): Promise<PortfolioBalanceResponse> {
    const resource = `brokerage/intx/balances/${portfolioId}`;
    const response = await this.apiClient.get(resource);
    return response.data;
  }

  /**
   * Opt In or Out of Multi Asset Collateral
   *
   * @param data - request body see SetMultiAssetCollateralPayload
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_intxmultiassetcollateral/
   */
  async setMultiAssetCollateral(data: SetMultiAssetCollateralPayload): Promise<SetMultiAssetCollateralResponse> {
    const resource = `/brokerage/intx/multi_asset_collateral`;
    const response = await this.apiClient.post(resource, data);
    return response.data;
  }
}
