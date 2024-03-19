# Coinbase API

Unofficial Coinbase API for Node.js, written in TypeScript and covered by tests. Covers both the [Advanced Trade API](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) & [Sign In With Coinbase API](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/welcome)

## Motivation

The purpose of this [coinbase-advanced-node][5] package is to maintain a recent Coinbase API for Node.js with type safety through TypeScript. This project began as a fork of [coinbase-pro-node](https://github.com/bennycode/coinbase-pro-node) in efforts to provide a smooth transition for anyone migrating to the [Advanced Trade API](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) due to the deprecation of the former [Exchange/Pro API](https://docs.cloud.coinbase.com/exchange/docs/welcome).

## Features

- **Typed.** Source code is 100% TypeScript. No need to install external typings.
- **Tested.** Code coverage is 100%. No surprises when using "coinbase-advanced-node".
- **Convenient.** Request throttling is built-in. Don't worry about rate limiting.
- **Comfortable.** More than an API client. You will get extras like [candle watching](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/rest-watch-candles.ts).
- **Maintained.** Automated security updates. No threats from outdated dependencies.
- **Documented.** Get started with [demo scripts][3] and [generated documentation][4].
- **Modern.** HTTP client with Promise API. Don't lose yourself in callback hell.
- **Robust.** WebSocket reconnection is built-in. No problems if your Wi-Fi is gone.
- **Reliable.** Following [semantic versioning][8]. Get notified about breaking changes.

## Installation

**npm**

```bash
npm install coinbase-advanced-node
```

**Yarn**

```bash
yarn add coinbase-advanced-node
```

## Setup

**JavaScript**

```javascript
const {Coinbase} = require('coinbase-advanced-node');
const client = new Coinbase(creds);
```

**TypeScript**

```typescript
import {Coinbase} from 'coinbase-advanced-node';
const client = new Coinbase(creds);
```

## Authentication Schemes

All Advanced Trade & SIWC API calls require authentication, Coinbase has multiple authentication schemes available for different APIs, all schemes are supported in this library. Click [here](https://docs.cloud.coinbase.com/advanced-trade-api/docs/auth) for more info.

## Usage

The [demo section](#demos) provides many examples on how to use "coinbase-advanced-node". For a quick start, below is a simple example for a REST request

All authentication methods require that you obtain correct permissions (scopes) to access different API endpoints. Read more about scopes [here](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/scopes)

For [Advanced Trade](https://docs.cloud.coinbase.com/advanced-trade-api/docs/welcome) orders, use the `order` API. The `buy` & `sell` API's exposed are part of the [Sign In With Coinbase API](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/welcome) which have different capabilities and fee structures

### REST Example

```typescript
import {Coinbase} from 'coinbase-advanced-node';

// Cloud API Keys Can be Generated here
// https://cloud.coinbase.com/access/api
// Cloud API keys can only be used on andvance trade endpoints
const cloudAuth = {
  cloudApiKeyName: 'organizations/{org_id}/apiKeys/{key_id}',
  cloudApiSecret: '-----BEGIN EC PRIVATE KEY-----\nYOUR PRIVATE KEY\n-----END EC PRIVATE KEY-----\n',
};

const cloudClient = new Coinbase(cloudAuth);
cloudClient.rest.product.getProducts().then(prods => {
  const message = `Total Products ${prods.data.length}.`;
  console.log(message);
});

// Legacy API keys and OAuth are supported in
// SIWC API's and some of the Advance Trade API's
// https://docs.cloud.coinbase.com/advanced-trade-api/docs/auth

// Legacy API Keys can be generated here:
// https://www.coinbase.com/settings/api
const auth = {
  apiKey: 'ohnwkjnefasodh;',
  apiSecret: 'asdlnasdoiujkswdfsdf',
};

const legacyClient = new Coinbase(auth);
legacyClient.rest.account.listAccounts().then(accounts => {
  const message = `Advance Trade accounts "${accounts.data.length}".`;
  console.log(message);
});

// View OAuth setup info here
// https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/sign-in-with-coinbase-integration#registering-oauth2-client
const oauth = {
  oauthToken: 'ej09joiunasgukddd09ujoh2i4r874nkjnk;lajs;dlfjaljhfds;sdhjfsdf=',
};

const oauthClient = new Coinbase(oauth);
oauthClient.rest.account.listCoinbaseAccounts().then(accounts => {
  const message = `Coinbase accounts ${accounts.data.length}.`;
  console.log(message);
});
```

## Two Factor Authentication

OAuth2 authentication requires two factor authentication when debiting funds with the `wallet:transactions:send` scope. When 2FA is required, the API will respond with a `402` status and two_factor_required error. To successfully complete the request, you must make the same request again with the user's 2FA token in the `CB-2FA-TOKEN` header together with the current access token. https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/sign-in-with-coinbase-2fa

```typescript
// Example
const client = new Coinbase(creds);
client.rest.transaction.sendTransaction(accountID, info).catch(async err => {
  if (err.status == 402) {
    const token = await promptUserForMFA();
    const configID = client.rest.interceptors.request.use(config => {
      config.headers['CB-2FA-TOKEN'] = token;
      return config;
    });
    return client.rest.transaction.sendTransaction(accountID, info).finally(() => {
      client.rest.interceptors.request.eject(configID);
    });
  }
  throw err;
});
```

## Additional Endpoints

In the instance this package has not been updated to include some endpoint(s) you may need, use the `coinbaseRequest` which will properly sign & proxy the request. Please [open an issue](https://github.com/JoshJancula/coinbase-advanced-node/issues) if this occurs.

```typescript
const client = new Coinbase(creds);
const info = await client.rest.coinbaseRequest({
  baseURL: client.url.REST_ADV_TRADE,
  method: 'get',
  url: '/brokerage/products',
});
console.info('products data: ', info.data);
```

### WebSocket Example

If you want to listen to WebSocket messages, have a look at these demo scripts:

- [Subscribe to "ticker" channel (real-time price updates)](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/websocket-ticker.ts)
- [Subscribe to authenticated "user" channel](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/websocket-user.ts)

### Demos

All [demo scripts][3] are executable from the root directory. If you want to use specific credentials with a demo script, simply add a `.env` file to the root of this package to [modify environment variables](https://github.com/motdotla/dotenv/tree/v8.2.0#usage) used in [init-client.ts](https://github.com/joshjancula/coinbase-advanced-node/blob/main/src/demo/init-client.ts).

```bash
npx ts-node ./src/demo/dump-candles.ts
```

**Tip:** There is a [.env.defaults](https://github.com/joshjancula/coinbase-advanced-node/blob/main/.env.defaults) file which serves as a template. Just remove its `.defaults` extension and enter your credentials to get started. Do not commit this file (or your credentials) to any repository!

### Web Frontend Applications

The "coinbase-advanced-node" library was built to be used in Node.js environments BUT you can also make use of it in web frontend applications (using React, Vue.js, etc.). However, due to the [CORS restrictions](https://developer.mozilla.org/docs/Web/HTTP/CORS) of modern web browser, you will have to use a proxy server.

A proxy server can be setup with webpack's [DevServer proxy configuration](https://webpack.js.org/configuration/dev-server/#devserverproxy) or [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware).

Here is an example:

**Backend**

```typescript
import {createProxyMiddleware} from 'http-proxy-middleware';
import express from 'express';

const app = express();

app.use(
  '/api-coinbase-siwc',
  createProxyMiddleware({
    target: 'ttps://api.coinbase.com/v2',
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-siwc`]: '',
    },
  })
);
app.use(
  '/api-coinbase-adv',
  createProxyMiddleware({
    target: 'ttps://api.coinbase.com/v3',
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-adv`]: '',
    },
  })
);
```

Later on, you can use the proxy URLs (`/api-coinbase-adv` from above) in your web application to initialize "coinbase-advanced-node" with it:

**Frontend**

```typescript
const client = new Coinbase({
  httpUrl: '/api-coinbase-siwc',
  apiKey: '',
  apiSecret: '',
});
```

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/joshjancula/coinbase-advanced-node/issues).

The following commits will help you getting started quickly with the code base:

- [Add REST API endpoint](https://github.com/bennycode/coinbase-prod-node/commit/9920c2f4343985c349b68e2a47d7fe2c42e23e34)
- [Add REST API endpoint (with fixtures)](https://github.com/bennycode/coinbase-pro-node/commit/8a150fecb7d32b7b7cd39a8109985f665aaee26e)

All resources can be found in the [Coinbase Advance Trade API reference][2]. For the latest updates, check [Coinbase's API Changelog][9].

## License

This project is [MIT](./LICENSE) licensed.

## ⭐️ Show your support ⭐️

[Please leave a star](https://github.com/joshjancula/coinbase-advanced-node/stargazers) if you find this project useful.

## If you'd like to make a donation

```
BTC: bc1qctv0q7vlcc80x72z40m6d02spu828tw4rt6jjm
SOL: PKFFsyqAGZ63U3KViqxLBTfX3r9LjgxrVeBoxTxzbrB
ATOM: cosmos14c3dsfutycuzjglvhgj4dacmurjsh2wvtehh08
```
