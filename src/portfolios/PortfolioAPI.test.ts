import nock from 'nock';
import {PortfolioTypes} from './PortfolioAPI';

describe('PortfolioAPI', () => {
  afterEach(() => nock.cleanAll());

  describe('getPortfolios', () => {
    it('should list portfolios', async () => {
      nock(global.REST_URL)
        .get(`/brokerage/portfolios`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            portfolios: [
              {
                deleted: 'boolean',
                name: 'test',
                type: PortfolioTypes.CONSUMER,
                uuid: 'string',
              },
            ],
          });
        });

      const portfolios = await global.client.rest.portfolios.getPortfolios();

      expect(portfolios.length).toBe(1);
      expect(portfolios[0].name).toBe('test');
    });
  });

  describe('createPortfolio', () => {
    it('should creates a new portfolio', async () => {
      nock(global.REST_URL)
        .post(`/brokerage/portfolios`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            portfolio: {
              deleted: 'boolean',
              name: 'new portfolio',
              type: PortfolioTypes.CONSUMER,
              uuid: 'string',
            },
          });
        });

      const portfolio = await global.client.rest.portfolios.createPortfolio('new portfolio');

      expect(portfolio).toBeDefined();
      expect(portfolio.name).toBe('new portfolio');
    });
  });

  describe('transferFunds', () => {
    const source_portfolio_uuid = 'xxxxxxxx';
    const target_portfolio_uuid = 'yyyyyyyyy';

    it('should transfer funds', async () => {
      nock(global.REST_URL)
        .post(`/brokerage/portfolios/move_funds`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            source_portfolio_uuid,
            target_portfolio_uuid,
          });
        });

      const res = await global.client.rest.portfolios.transferFunds({
        funds: {
          currency: 'USD',
          value: '10.00',
        },
        source_portfolio_uuid,
        target_portfolio_uuid,
      });

      expect(res).toBeDefined();
      expect(res.source_portfolio_uuid).toBe(source_portfolio_uuid);
    });
  });

  describe('getPortfolioBreakdown', () => {
    const source_portfolio_uuid = 'xxxxxxxx';

    it('should get some portfolio info', async () => {
      nock(global.REST_URL)
        .get(`/brokerage/portfolios/${source_portfolio_uuid}`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            breakdown: {
              futures_positions: [
                {
                  amount: 'string',
                  asset_img_url: 'string',
                  avg_entry_price: 'string',
                  contract_size: 'string',
                  current_price: 'string',
                  expiry: 'string',
                  notional_value: 'string',
                  product_id: 'string',
                  product_name: 'string',
                  side: 'FUTURES_POSITION_SIDE_UNSPECIFIED',
                  underlying_asset: 'string',
                  unrealized_pnl: 'string',
                  venue: 'string',
                },
              ],
              perp_positions: [
                {
                  asset_image_url: 'string',
                  buy_order_size: 'string',
                  im_contribution: 'string',
                  im_notional: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  leverage: 'string',
                  liquidation_buffer: 'string',
                  liquidation_percentage: 'string',
                  liquidation_price: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  margin_type: 'MARGIN_TYPE_UNSPECIFIED',
                  mark_price: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  mm_notional: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  net_size: 'string',
                  position_notional: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  position_side: 'FUTURES_POSITION_SIDE_UNSPECIFIED',
                  product_id: 'string',
                  product_uuid: 'string',
                  sell_order_size: 'string',
                  symbol: 'string',
                  unrealized_pnl: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                  vwap: {
                    rawCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                    userNativeCurrency: {
                      currency: 'string',
                      value: 'string',
                    },
                  },
                },
              ],
              portfolio: {
                deleted: 'boolean',
                name: 'string',
                type: 'UNDEFINED',
                uuid: 'string',
              },
              portfolio_balances: {
                futures_unrealized_pnl: {
                  currency: 'string',
                  value: 'string',
                },
                perp_unrealized_pnl: {
                  currency: 'string',
                  value: 'string',
                },
                total_balance: {
                  currency: 'string',
                  value: 'string',
                },
                total_cash_equivalent_balance: {
                  currency: 'string',
                  value: 'string',
                },
                total_crypto_balance: {
                  currency: 'string',
                  value: 'string',
                },
                total_futures_balance: {
                  currency: 'string',
                  value: 'string',
                },
              },
              spot_positions: [
                {
                  account_uuid: 'string',
                  allocation: 'number',
                  asset: 'string',
                  asset_img_url: 'string',
                  available_to_trade_fiat: 'number',
                  cost_basis: {
                    currency: 'string',
                    value: 'string',
                  },
                  is_cash: 'boolean',
                  one_day_change: 'number',
                  total_balance_crypto: 'number',
                  total_balance_fiat: 'number',
                },
              ],
            },
          });
        });

      const res = await global.client.rest.portfolios.getPortfolioBreakdown(source_portfolio_uuid);

      expect(res).toBeDefined();
      expect(res.futures_positions.length).toBe(1);
    });
  });

  describe('deletePortfolio', () => {
    const target_portfolio_uuid = 'yyyyyyyyy';

    it('should delete a portfolio', async () => {
      nock(global.REST_URL)
        .delete(`/brokerage/portfolios/${target_portfolio_uuid}`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({});
        });

      const res = await global.client.rest.portfolios.deletePortfolio(target_portfolio_uuid);
      expect(res).toBeDefined();
    });
  });

  describe('editPortfolio', () => {
    const target_portfolio_uuid = 'yyyyyyyyy';

    it('should edit a portfolio', async () => {
      nock(global.REST_URL)
        .put(`/brokerage/portfolios/${target_portfolio_uuid}`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            portfolio: {
              deleted: 'boolean',
              name: 'new name',
              type: PortfolioTypes.CONSUMER,
              uuid: 'string',
            },
          });
        });

      const portfolio = await global.client.rest.portfolios.editPortfolio(target_portfolio_uuid, {name: 'new name'});

      expect(portfolio).toBeDefined();
      expect(portfolio.name).toBe('new name');
    });
  });
});
