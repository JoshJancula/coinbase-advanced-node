import {AxiosInstance} from 'axios';

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

export class UserAPI {
  static readonly URL: {USERS: string} = {
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
   * Get current user's authorization information including granted scopes and send limits when using OAuth2 authentication.
   *
   * @see https://docs.cdp.coinbase.com/sign-in-with-coinbase/docs/api-users#show-authorization-information
   */
  async fetchAuthorizationInfo(): Promise<UserAuthorizationInfo> {
    const resource = `${UserAPI.URL.USERS}/auth`;
    const response = await this.apiClient.get<any>(resource);
    return response.data.data;
  }
}
