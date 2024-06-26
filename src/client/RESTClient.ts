import axios, {
  AxiosDefaults,
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {AccountAPI} from '../account';
import {RequestSetup, SignedRequest} from '../auth/RequestSigner';
import {OrderAPI} from '../order';
import {Candle, CandleGranularity, ProductAPI, ProductEvent} from '../product';
import {UserAPI} from '../user';
import {FeeAPI} from '../fee';
import {FillAPI} from '../fill';
import querystring from 'querystring';
import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';
import util, {DebugLogger} from 'util';
import {EventEmitter} from 'events';
import {getErrorMessage, gotRateLimited, inAirPlaneMode} from '../error/ErrorUtil';
import {CurrencyAPI} from '../currency';
import {WithdrawAPI} from '../withdraw';
import {TimeAPI} from '../time';
import {ExchangeRateAPI} from '../exchange-rate/ExchangeRateAPI';
import {ClientConnection} from '../Coinbase';
import {TransactionAPI} from '../transaction/TransactionAPI';
import {DepositAPI} from '../deposit';
import {AddressAPI} from '../addresses';
import {BuyAPI} from '../buy';
import {SellAPI} from '../sell';
import {PortfolioAPI} from '../portfolios';
import {ConvertAPI} from '../convert/ConvertAPI';
import {serializeParamsArray} from '../util/shared-request';
import {PaymentAPI} from '../payment/PaymentAPI';

export interface RESTClient {
  on(
    event: ProductEvent.NEW_CANDLE,
    listener: (productId: string, granularity: CandleGranularity, candle: Candle) => void
  ): this;
}

// eslint-disable-next-line no-redeclare
export class RESTClient extends EventEmitter {
  get defaults(): AxiosDefaults {
    return this.httpClient.defaults;
  }

  get interceptors(): {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  } {
    return this.httpClient.interceptors;
  }

  readonly account: AccountAPI;
  readonly address: AddressAPI;
  /**
   * @deprecated
   * On November 30, 2023 the Sign in with Coinbase v2 Buys and Sells APIs were deprecated.
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/changelog#2023-oct-23
   */
  readonly buy: BuyAPI;
  readonly convert: ConvertAPI;
  readonly currency: CurrencyAPI;
  readonly deposit: DepositAPI;
  readonly exchangeRate: ExchangeRateAPI;
  readonly fee: FeeAPI;
  readonly fill: FillAPI;
  readonly order: OrderAPI;
  readonly payment: PaymentAPI;
  readonly portfolios: PortfolioAPI;
  readonly product: ProductAPI;
  /**
   * @deprecated
   * On November 30, 2023 the Sign in with Coinbase v2 Buys and Sells APIs were deprecated.
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/changelog#2023-oct-23
   */
  readonly sell: SellAPI;
  readonly time: TimeAPI;
  readonly transaction: TransactionAPI;
  readonly user: UserAPI;
  readonly withdraw: WithdrawAPI;

  private readonly httpClient: AxiosInstance;
  private readonly logger: DebugLogger;

  constructor(
    connectionData: ClientConnection,
    private readonly signRequest: (setup: RequestSetup) => Promise<SignedRequest>
  ) {
    super();
    this.logger = util.debuglog('coinbase-advanced-node');

    this.httpClient = axios.create({
      paramsSerializer: serializeParamsArray,
      timeout: 50_000,
    });

    axiosRetry(this.httpClient, {
      retries: Infinity,
      retryCondition: (error: AxiosError) => {
        return isNetworkOrIdempotentRequestError(error) || inAirPlaneMode(error) || gotRateLimited(error);
      },
      retryDelay: (retryCount: number, error: AxiosError) => {
        const errorMessage = getErrorMessage(error);
        this.logger(
          `#${retryCount} There was an error querying "${error?.config?.baseURL}${error?.config?.url}": ${errorMessage}`
        );
        /**
         * Rate limits:
         * - 3 requests per second, up to 6 requests per second in bursts for public endpoints
         * - 5 requests per second, up to 10 requests per second in bursts for private endpoints
         * @see https://docs.cloud.coinbase.com/exchange/docs/rate-limits
         */
        return 1000;
      },
      shouldResetTimeout: true,
    });

    this.httpClient.interceptors.request.use(async config => {
      const baseURL =
        config.baseURL ||
        String(
          (config.url || '').search('v3|brokerage') > -1 ? connectionData.REST_ADV_TRADE : connectionData.REST_SIWC
        );
      config.baseURL = baseURL;
      const url = String(baseURL + config.url);
      let requestPath = url.replace(url.split(baseURL.includes('v3') ? '/api/v3/' : '/v2')[0], '');

      if (config.baseURL?.includes('v3')) {
        requestPath = requestPath.replace(requestPath.split('?')[1], '');
      }

      const signedRequest = await this.signRequest({
        baseUrl: config.baseURL,
        httpMethod: String(config.method).toUpperCase(),
        payload: RESTClient.stringifyPayload(config, config.baseURL.includes('v3')),
        requestPath,
      });

      if (signedRequest.oauth || signedRequest.jwt) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${signedRequest.key}`,
          'CB-ACCESS-TIMESTAMP': `${signedRequest.timestamp}`,
        } as any;
      } else {
        config.headers = {
          ...config.headers,
          'CB-ACCESS-TIMESTAMP': `${signedRequest.timestamp}`,
        } as any;
        if (signedRequest.key) {
          config.headers['CB-ACCESS-SIGN'] = signedRequest.signature;
          config.headers['CB-ACCESS-KEY'] = signedRequest.key;
        } else {
          const isProductApi = Object.values(ProductAPI.URL).find(v => config.url?.includes(v));
          if (isProductApi) {
            config.url = config.url?.replace(`brokerage/`, `brokerage/market/`);
          }
        }
      }

      if (!config.baseURL?.includes('v3')) {
        config.headers['CB-VERSION'] = new Date().toISOString().substring(0, 10);
      }

      return config;
    });

    this.address = new AddressAPI(this.httpClient);
    this.account = new AccountAPI(this.httpClient);
    this.buy = new BuyAPI(this.httpClient);
    this.deposit = new DepositAPI(this.httpClient);
    this.currency = new CurrencyAPI(this.httpClient);
    this.exchangeRate = new ExchangeRateAPI();
    this.fee = new FeeAPI(this.httpClient);
    this.fill = new FillAPI(this.httpClient);
    this.order = new OrderAPI(this.httpClient);
    this.product = new ProductAPI(this.httpClient, this);
    this.sell = new SellAPI(this.httpClient);
    this.time = new TimeAPI(connectionData.REST_SIWC, connectionData.REST_ADV_TRADE);
    this.transaction = new TransactionAPI(this.httpClient);
    this.user = new UserAPI(this.httpClient);
    this.withdraw = new WithdrawAPI(this.httpClient);
    this.portfolios = new PortfolioAPI(this.httpClient);
    this.convert = new ConvertAPI(this.httpClient);
    this.payment = new PaymentAPI(this.httpClient);
  }

  static stringifyPayload(config: AxiosRequestConfig, excludeParams?: boolean): string {
    if (config.data) {
      return JSON.stringify(config.data);
    }
    const params = querystring.stringify(config.params);
    return params && !excludeParams ? `?${params}` : '';
  }

  public coinbaseRequest(config: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
    return this.httpClient.request(config);
  }
}
