import axios, {AxiosInstance} from 'axios';
import {ISO_8601_MS_UTC} from '../payload';

export interface TimeSkew {
  /** The epoch field represents decimal seconds since Unix Epoch, i.e. "1420674445.201" */
  epoch: number;
  /** Time in ISO 8601 format, i.e. "2015-01-07T23:47:25.201Z" */
  iso: ISO_8601_MS_UTC;
}

export interface AdvanceApiTime {
  epochMillis: string;
  epochSeconds: string;
  iso: ISO_8601_MS_UTC;
}

export class TimeAPI {
  static readonly URL = {
    TIME: `/time`,
  };

  constructor(private readonly siwcUrl: string, private readonly advTradeUrl: string) {}

  /**
   * This endpoint does not require auth
   * Get the server time from Coinbase Pro API. It has been reported that sometimes the return value is a string:
   * https://github.com/bennycode/coinbase-pro-node/issues/354
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-time
   */
  async getTime(): Promise<TimeSkew> {
    const client = this.getClient(this.siwcUrl);
    const response = await client.get<any>(`${TimeAPI.URL.TIME}`, {});
    return response.data.data;
  }

  /**
   * Get the current time from the Coinbase Advanced API.
   * This endpoint requires authentication
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getunixtime
   */
  async getAdvanceApiTime(): Promise<AdvanceApiTime> {
    const client = this.getClient(this.advTradeUrl);
    const response = await client.get<any>(`/brokerage${TimeAPI.URL.TIME}`, {});
    return response.data;
  }

  /**
   * Get the absolute difference between server time and local time.
   */
  getClockSkew(time: TimeSkew): number {
    const now = Math.floor(Date.now() / 1000);
    return time?.epoch - now;
  }

  private getClient(baseUrl: string): AxiosInstance {
    const client = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
    });
    client.interceptors.request.use(config => {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      } as any;
      return config;
    });
    return client;
  }
}
