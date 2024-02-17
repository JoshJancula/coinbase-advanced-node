import nock from 'nock';

const mockConvert = {
  trade: {
    amount: {
      currency: 'string',
      value: 'string',
    },
    cancellation_reason: {
      code: 'string',
      error_code: 'ERROR_CODES_UNSPECIFIED',
      error_cta: 'ERROR_CTA_UNSPECIFIED',
      message: 'string',
    },
    exchange_rate: {
      currency: 'string',
      value: 'string',
    },
    fees: [
      {
        amount: {
          currency: 'string',
          value: 'string',
        },
        description: 'string',
        disclosure: {
          description: 'string',
          link: {
            text: 'string',
            url: 'string',
          },
          title: 'string',
        },
        label: 'string',
        title: 'string',
      },
    ],
    fiat_denoted_total: {
      currency: 'string',
      value: 'string',
    },
    id: 'string',
    source: {
      ledger_account: {
        account_id: 'string',
        currency: 'string',
        owner: {
          id: 'string',
          type: 'UNKNOWN',
          user_uuid: 'string',
          uuid: 'string',
        },
      },
      network: 'string',
      type: 'INVALID',
    },
    source_currency: 'string',
    source_id: 'string',
    status: 'TRADE_STATUS_UNSPECIFIED',
    subtotal: {
      currency: 'string',
      value: 'string',
    },
    target: {
      ledger_account: {
        account_id: 'string',
        currency: 'string',
        owner: {
          id: 'string',
          type: 'UNKNOWN',
          user_uuid: 'string',
          uuid: 'string',
        },
      },
      network: 'string',
      type: 'INVALID',
    },
    target_currency: 'string',
    target_id: 'string',
    tax_details: [
      {
        amount: {
          currency: 'string',
          value: 'string',
        },
        name: 'string',
      },
    ],
    total: {
      currency: 'string',
      value: 'string',
    },
    total_fee: {
      amount: {
        currency: 'string',
        value: 'string',
      },
      description: 'string',
      disclosure: {
        description: 'string',
        link: {
          text: 'string',
          url: 'string',
        },
        title: 'string',
      },
      label: 'string',
      title: 'string',
    },
    total_fee_without_tax: {
      amount: {
        currency: 'string',
        value: 'string',
      },
      description: 'string',
      disclosure: {
        description: 'string',
        link: {
          text: 'string',
          url: 'string',
        },
        title: 'string',
      },
      label: 'string',
      title: 'string',
    },
    trade_incentive_info: {
      applied_incentive: 'boolean',
      code_val: 'string',
      ends_at: 'string',
      fee_without_incentive: {
        currency: 'string',
        value: 'string',
      },
      redeemed: 'boolean',
      user_incentive_id: 'string',
    },
    unit_price: {
      source_to_fiat: {
        amount: {
          currency: 'string',
          value: 'string',
        },
        scale: 'integer',
      },
      target_to_fiat: {
        amount: {
          currency: 'string',
          value: 'string',
        },
        scale: 'integer',
      },
      target_to_source: {
        amount: {
          currency: 'string',
          value: 'string',
        },
        scale: 'integer',
      },
    },
    user_entered_amount: {
      currency: 'string',
      value: 'string',
    },
    user_reference: 'string',
    user_warnings: [
      {
        code: 'string',
        context: {
          details: ['string'],
          link_text: 'string',
          title: 'string',
        },
        id: 'string',
        link: {
          text: 'string',
          url: 'string',
        },
        message: 'string',
      },
    ],
  },
};

describe('ConvertAPI', () => {
  afterEach(() => nock.cleanAll());

  describe('getConvertTrade', () => {
    it('should get the trade', async () => {
      nock(global.REST_URL)
        .get(`/brokerage/convert/trade/${mockConvert.trade.id}`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify(mockConvert);
        });

      const trade = await global.client.rest.convert.getConvertTrade(mockConvert.trade.id);

      expect(trade.amount.value).toBe(mockConvert.trade.amount.value);
    });
  });

  describe('createQuote', () => {
    it('should create a quote', async () => {
      nock(global.REST_URL)
        .post(`/brokerage/convert/quote`)
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify(mockConvert);
        });

      const quote = await global.client.rest.convert.createQuote({
        amount: '10.0',
        from_account: '1_xxxxxxxxxxx',
        to_account: '2_xxxxxxxxxxxx',
      });

      expect(quote).toBeDefined();
    });
  });
});
