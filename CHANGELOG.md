### 4.1.0 (2024-10-28)

##### Chores

*  Deprecated failure_reason and (top-level) order_id from Create Order. ([62cae248](https://github.com/joshjancula/coinbase-advanced-node/commit/62cae248d9d427730fc93bfa3cc9addb0c348366))
*  Deprecated the retail_portfolio_id field for CDP keys, legacy keys unaffected ([2fa920e9](https://github.com/joshjancula/coinbase-advanced-node/commit/2fa920e9804b0f1c5169e13004568fe3b6d6e8ae))
*  new user endpoint for info  about your CDP API key permissions ([9bd00eda](https://github.com/joshjancula/coinbase-advanced-node/commit/9bd00eda324bd6680a2a884dedbbf012a0a0b55a))
*  add perpetual futures and expiring futures positions info on user ws ([232670af](https://github.com/joshjancula/coinbase-advanced-node/commit/232670af4e9bf95213ad5218288e9704981e9436))
*  support plural params & mark singular for deprecation ([f5baa683](https://github.com/joshjancula/coinbase-advanced-node/commit/f5baa6831e1e1bbdb048485731b6f4cb0c2361bc))

##### New Features

*  Added Futures Balance Summary WebSocket channel for client connections ([d4d7c620](https://github.com/joshjancula/coinbase-advanced-node/commit/d4d7c62033ce6196a8a128763baa3e5ac1d7ceda))

##### Bug Fixes

*  unit test in order ([412f3ef2](https://github.com/joshjancula/coinbase-advanced-node/commit/412f3ef2f4a1341712412d5ddab5596c264f84cf))

##### Other Changes

*  Sign In With Coinbase (SIWC) is now Coinbase App ([5f518439](https://github.com/joshjancula/coinbase-advanced-node/commit/5f5184390d0273d0db2d68bc6f5447c9c72f21cb))
*  update docs for sandbox ([66f5e50c](https://github.com/joshjancula/coinbase-advanced-node/commit/66f5e50c17a7949538fa3c863722ba20b5117562))

### 4.0.0 (2024-06-24)

##### Chores

*  add null check ([ecd183de](https://github.com/joshjancula/coinbase-advanced-node/commit/ecd183de1831dfd076adf0621b1f07dbd9ec7d21))
*  updating perpetuals ([6cc0bba9](https://github.com/joshjancula/coinbase-advanced-node/commit/6cc0bba9affc10ecd7fb4d678dc1f1079785d4f5))
*  update retail_portfolio_id on Account responses ([84283fac](https://github.com/joshjancula/coinbase-advanced-node/commit/84283face97faf15fcc23cec7ceb2bdc0ef14067))
*  add margin_window_measures to futures balance summary ([46d8ccca](https://github.com/joshjancula/coinbase-advanced-node/commit/46d8ccca30a2907078fe89b1d5a33e7ea7a29db2))
*  Get Intraday Margin Setting ([446e494d](https://github.com/joshjancula/coinbase-advanced-node/commit/446e494da486d89f9c854cb37ce975110a39b55b))
*  support intraday margin_setting & current_margin_window ([3edea78e](https://github.com/joshjancula/coinbase-advanced-node/commit/3edea78e4d75c5a0bbfed10262729670ad5ed7e0))
*  Added get_tradability_status on product apis to populate the view_only field in the response ([0a98ed34](https://github.com/joshjancula/coinbase-advanced-node/commit/0a98ed34bd27104c8bd5d24ee948fd2aa27037e6))
*  Added retail_portfolio_id to fills params & response ([c72e2aa4](https://github.com/joshjancula/coinbase-advanced-node/commit/c72e2aa435a4a72df824f52fc9a7777591cfb514))

##### New Features

*  universal pagination & ability to isolate per api spec ([f9de0832](https://github.com/joshjancula/coinbase-advanced-node/commit/f9de0832254e674061ec9206c72c3ecfcb389100))
*  support intx balances &  multi_asset_collateral ([f316e8d0](https://github.com/joshjancula/coinbase-advanced-node/commit/f316e8d03fbcf1136513c223e0e3e82205939063))

##### Other Changes

*  update docs from cb domain swap ([fa5e6711](https://github.com/joshjancula/coinbase-advanced-node/commit/fa5e67116135471ef564d8c0b0f7e997a4ed716c))

### 3.4.0 (2024-04-18)

##### Chores

*  support bracket & fok orders, updated typedoc ([49b89891](https://github.com/joshjancula/coinbase-advanced-node/commit/49b89891d50469e5bd650eba30d488fc581442db))

##### New Features

*  support public endpoints ([8e365bd7](https://github.com/joshjancula/coinbase-advanced-node/commit/8e365bd742ac18acea6b33ecc102016ccb2058c7))

##### Bug Fixes

*  params for getTrades & updated unit test ([e50601e4](https://github.com/joshjancula/coinbase-advanced-node/commit/e50601e4f97c1b253e688cd9f1765df1632a9bff))

### 3.3.0 (2024-04-12)

##### Chores

*  update typedoc and remove unecessary proxy of accountId ([8293c560](https://github.com/joshjancula/coinbase-advanced-node/commit/8293c5605ed2a45501d981a940184b3bc5bb2db1))
*  mark siwc v2 buy/sell as deprecated ([22208658](https://github.com/joshjancula/coinbase-advanced-node/commit/22208658a5ab59e9152a959807072809ec945a7c))

##### Bug Fixes

*  resolve params in shared req ([976acada](https://github.com/joshjancula/coinbase-advanced-node/commit/976acada320d14e04ef9b6a76d44faf0e0e98ef0))

### 3.2.0 (2024-04-05)

##### Chores

*  fix types ([7e014e87](https://github.com/joshjancula/coinbase-advanced-node/commit/7e014e87af6e889227e5e4ff72143b8c334cdd18))
*  add types & expose close position ([fddf1a4c](https://github.com/joshjancula/coinbase-advanced-node/commit/fddf1a4c90a5bff00e0d1509bd3b3a30baca0854))
*  siwc supports cloud auth now ([4d8b1a43](https://github.com/joshjancula/coinbase-advanced-node/commit/4d8b1a437a150e161498710e136d8a4f4e37a37d))

##### Documentation Changes

*  updated readme ([3f6575d3](https://github.com/joshjancula/coinbase-advanced-node/commit/3f6575d3744137d44345d0efa9c16bd33b58be23))

### 3.1.0 (2024-03-19)

##### Chores

*  support for Limit IOC orders ([06401a04](https://github.com/joshjancula/coinbase-advanced-node/commit/06401a049bf7d0b16670e6bacb7df1d19e0f0580))
*  Added Limit Price and Stop Limit Price to messages for the Websocket User Channel ([8185d04f](https://github.com/joshjancula/coinbase-advanced-node/commit/8185d04f23f921e3151542935e2f3a48325333df))

##### New Features

*  support payment api ([d526c942](https://github.com/joshjancula/coinbase-advanced-node/commit/d526c9428d116577a18f773d58ae3d586ed5ebe9))

##### Refactors

*  time api as it is now public ([3e422d67](https://github.com/joshjancula/coinbase-advanced-node/commit/3e422d6770b7399379f893285cd83b0116c92956))

### 3.0.1 (2024-02-26)

##### Bug Fixes

*  getBestAsksAndBids by removing [] from generated params ([7f6615c0](https://github.com/joshjancula/coinbase-advanced-node/commit/7f6615c0c7dce0b10756dda21bad726b13cd92d3))

### 3.0.0 (2024-02-17)

##### Chores

*  include self_trade_prevention_id on NewOrder ([914e1d69](https://github.com/joshjancula/coinbase-advanced-node/commit/914e1d69cd1c696665dce10aa6609b7e8fd59e98))

##### New Features

*  support conversion apis and adv time ([13064918](https://github.com/joshjancula/coinbase-advanced-node/commit/1306491837f56cb08d3ccb0c2bf0ae80bcf4e16b))
*  add preview / edit order ([5f8a0c23](https://github.com/joshjancula/coinbase-advanced-node/commit/5f8a0c238c0dee82ffa025f204edb8c61b1eacc4))
*  support for portfolios ([e9aa40a4](https://github.com/joshjancula/coinbase-advanced-node/commit/e9aa40a4990b018e3bc99d8303ee3c80d0f1677b))
*  support cloud trading keys ([3246f875](https://github.com/joshjancula/coinbase-advanced-node/commit/3246f875c07457456b5112529912d7a065944c08))

##### Other Changes

*  update demo script ([3dc21e9d](https://github.com/joshjancula/coinbase-advanced-node/commit/3dc21e9dbbe616b3b406ad04af6b83b76de6c241))

### 2.1.0 (2023-12-14)

##### Bug Fixes

*  baseUrl for siwc innacurate ([f492c5b0](https://github.com/joshjancula/coinbase-advanced-node/commit/f492c5b0911539d0ef61d31bbcff434322b81a1a))

### 2.0.0 (2023-10-11)

### ⚠ BREAKING CHANGES

* websocket types & interfaces have been adjusted in order to properly support heartbeat sequencing

##### New Features

*  add coinbaseRequest ([d7eb7d5b](https://github.com/joshjancula/coinbase-advanced-node/commit/d7eb7d5bc78344648bb7b0c60ad0dea9c31ff07f))
*  add websocket support for candles & heartbeats ([c5e980ba](https://github.com/joshjancula/coinbase-advanced-node/commit/c5e980ba8ee4ab8befb5ae9575af1b0f805f9aae))

##### Chores

 *  Add product_ids[] to ProductsQueryParams ([42716987](https://github.com/joshjancula/coinbase-advanced-node/commit/427169879982dc848e4811e6772437bd69ead8d9))

### 1.2.0 (2023-07-03)

##### New Features

*  add endpoints & types for pricebooks ([ecd2fa69](https://github.com/joshjancula/coinbase-advanced-node/commit/ecd2fa69a32c23aa4550f221fab558766ca546e4))

### 1.0.3 (2023-02-20)

##### Chores

*  update types from feb 9 cb update ([43b11c53](https://github.com/joshjancula/coinbase-advanced-node/commit/43b11c5398e0abdd5e9494807c311c25549344e9))

### 1.0.2 (2023-01-31)

##### Bug Fixes

*  balance types, ws types, candle max, unit tests ([57a97b5f](https://github.com/joshjancula/coinbase-advanced-node/commit/57a97b5f2bf3f27e9730bf2bdcea6e40f55fd6a4))


### 1.0.1 (2023-01-25)

##### Bug Fixes

*  fill pagination, get order response type ([f80f6000](https://github.com/joshjancula/coinbase-advanced-node/commit/f80f60000d0db1b871c87f0d3d2426640b9c4bb8))
*  Fix typo get order, fix pagination format, update docs ([5c06487b](https://github.com/joshjancula/coinbase-advanced-node/commit/5c06487ba58767772a7c61b655f8ba1bdd73fe12))


## 1.0.0 (2023-01-23)

##### New Features

*  Add advance trade and siwc support ([9bacd6dc](https://github.com/joshjancula/coinbase-advanced-node/commit/9bacd6dc89a23f57ca40fe61f9f0a8dcd77e725c))
