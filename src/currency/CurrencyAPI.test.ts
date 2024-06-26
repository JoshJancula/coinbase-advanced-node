import nock from 'nock';
import {CurrencyAPI} from './CurrencyAPI';

describe('CurrencyAPI', () => {
  afterEach(() => nock.cleanAll());

  describe('listCurrencies', () => {
    it('list available currencies', async () => {
      nock(global.SIWC_REST_URL)
        .get(CurrencyAPI.URL.CURRENCIES)
        .query(true)
        .reply(200, JSON.stringify({data: [{id: 'BIF', min_size: '1.00000000', name: 'Burundian Franc'}]}));

      const currencies = await global.client.rest.currency.listCurrencies();

      expect(currencies.length).toBe(1);
      expect(currencies[0].id).toBe('BIF');
    });
  });
});
