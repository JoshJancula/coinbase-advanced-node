import crypto from 'crypto';
import {ClientAuthentication} from '../Coinbase';

export interface RequestSetup {
  baseUrl?: string;
  httpMethod: string;
  payload: string;
  requestPath: string;
  ws?: boolean;
}

export interface SignedRequest {
  jwt?: boolean;
  key: string | null;
  oauth?: boolean;
  signature?: string;
  timestamp: number;
}

export class RequestSigner {
  // https://docs.cloud.coinbase.com/exchange/docs/authorization-and-authentication#creating-a-request
  static signRequest(auth: ClientAuthentication, setup: RequestSetup, clockSkew: number): SignedRequest {
    const timestamp = Math.floor(Date.now() / 1000 + clockSkew);

    if (auth.oauthToken) {
      return {
        key: auth.oauthToken,
        oauth: true,
        timestamp,
      };
    }

    if (auth.cloudApiKeyName) {
      return {
        jwt: true,
        key: RequestSigner.buildJWT(auth, setup),
        timestamp,
      };
    }

    const what = `${timestamp}${setup.httpMethod.toUpperCase()}${setup.requestPath}${setup.payload}`;
    const sig = crypto.createHmac('sha256', auth.apiSecret || '').update(what);
    const signature = sig.digest('hex');
    return {
      key: auth.apiKey as string,
      signature,
      timestamp,
    };
  }

  static buildJWT(auth: ClientAuthentication, setup: RequestSetup): string {
    const {sign} = require('jsonwebtoken');
    const key_name = auth.cloudApiKeyName;
    const key_secret = auth.cloudApiSecret;
    const request_method = setup.httpMethod.toUpperCase();

    const url = setup.baseUrl?.startsWith('http') ? new URL(setup.baseUrl).hostname : '';

    const request_path = setup.requestPath;
    const service_name = setup.ws
      ? auth.cloudServiceNameWs || 'public_websocket_api'
      : auth.cloudServiceNameApi || 'retail_rest_api_proxy';

    const algorithm = 'ES256';
    const uri = setup.ws ? undefined : request_method + ' ' + url + request_path;

    const token = sign(
      {
        aud: [service_name],
        exp: Math.floor(Date.now() / 1000) + 120,
        iss: 'coinbase-cloud',
        nbf: Math.floor(Date.now() / 1000),
        sub: key_name,
        uri,
      },
      key_secret,
      {
        algorithm,
        header: {
          kid: key_name,
          nonce: crypto.randomBytes(16).toString('hex'),
        },
      }
    );

    return token;
  }
}
