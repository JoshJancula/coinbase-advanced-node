import {AxiosInstance} from 'axios';
import {UUID_V4} from '../payload';

export interface VerifiedUser {
  avatar_url: string;
  id: string;
  name: string;
  profile_bio: unknown;
  profile_location: unknown;
  profile_url: string;
  resource: string;
  resource_path: string;
  username: string;
}

export interface UserAuthorizationInfo {
  method: string;
  oauth_meta?: any;
  scopes: string[];
}

export interface CurrentApiKeyPermissions {
  can_trade: boolean;
  can_transfer: boolean;
  can_view: boolean;
  portfolio_type: 'UNDEFINED' | 'DEFAULT' | 'CONSUMER' | 'INTX';
  portfolio_uuid: UUID_V4;
}

export class UserAPI {
  static readonly URL: {API_KEYS: string; USERS: string} = {
    API_KEYS: '/brokerage/key_permissions',
    USERS: `/user`,
  };

  constructor(private readonly apiClient: AxiosInstance) {}

  /**
   * Get current user's public information. To get user's email or private information, use permissions wallet:user:email and wallet:user:read.
   *  If current request has a wallet:transactions:send scope, then the response will contain a boolean sends_disabled field that indicates if the user's send functionality has been disabled.
   *
   * @param id - if no id is provided we are fetching user associated to current auth creds
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-users#show-current-user
   */
  async fetchUserInfo(id?: string): Promise<VerifiedUser> {
    let resource = `${UserAPI.URL.USERS}`;
    if (id) {
      resource += `/${id}`;
    }
    const response = await this.apiClient.get<any>(resource);
    return response.data.data;
  }

  /**
   * @deprecated
   * Get current user's authorization information including granted scopes and send limits when using OAuth2 authentication.
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-users#show-authorization-information
   */
  async fetchAuthorizationInfo(): Promise<UserAuthorizationInfo> {
    const resource = `${UserAPI.URL.USERS}/auth`;
    const response = await this.apiClient.get<any>(resource);
    return response.data.data;
  }

  /**
   * Get information about your CDP API key permissions
   *
   * @see https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getapikeypermissions
   */
  async getApiKeyPermissions(): Promise<CurrentApiKeyPermissions> {
    const response = await this.apiClient.get<any>(UserAPI.URL.API_KEYS);
    return response.data;
  }
}
