import nock from 'nock';
import BTCEUR from '../test/fixtures/rest/fills/product_id/BTC-EUR/GET-200.json';
import {FillAPI} from './FillAPI';
import querystring from 'querystring';

describe('FillAPI', () => {
  afterAll(() => nock.cleanAll());

  beforeAll(() => {
    nock(global.REST_URL)
      .persist()
      .get(FillAPI.URL.FILLS)
      .query(true)
      .reply(uri => {
        const query = querystring.parse(`${global.REST_URL}${uri}`);
        const payload = BTCEUR;

        if (Object.keys(query).includes('?product_id')) {
          payload.fills = payload.fills.filter(filled => (filled.product_id = query['?product_id'] as string));
        }

        if (Object.keys(query).includes('?order_id')) {
          payload.fills = payload.fills.filter(filled => (filled.order_id = query['?order_id'] as string));
        }

        return [200, JSON.stringify(payload)];
      });
  });

  describe('getFillsByOrderId', () => {
    it('filters filled orders by order ID', async () => {
      const filledOrders = await global.client.rest.fill.getFillsByOrderId('0000-000000-000000');
      expect(filledOrders.data[0].trade_id).toBe('1111-11111-111111');
    });
  });

  describe('getFillsByProductId', () => {
    it('filters filled orders by product ID', async () => {
      const filledOrders = await global.client.rest.fill.getFillsByProductId('BTC-USD');
      expect(filledOrders.data.length).toBe(1);
    });
  });
});
