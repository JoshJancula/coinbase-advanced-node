import nock from 'nock';
import {PaymentAPI} from './PaymentAPI';

const MockPayment = {
  allow_buy: true,
  allow_deposit: true,
  allow_sell: true,
  allow_withdraw: true,
  created_at: '2021-05-31T09:59:59Z',
  currency: 'USD',
  id: '8bfc20d7-f7c6-4422-bf07-8243ca4169fe',
  name: 'ALLY BANK ******1234',
  type: 'ACH',
  updated_at: '2021-05-31T09:59:59Z',
  verified: true,
};

describe('PaymentAPI', () => {
  afterEach(() => nock.cleanAll());

  describe('listPaymentMethods', () => {
    it('lists available payment methods', async () => {
      nock(global.REST_URL)
        .get(PaymentAPI.URL.PAYMENTS)
        .query(true)
        .reply(200, JSON.stringify({payment_methods: [MockPayment]}));

      const methods = await global.client.rest.payment.listPaymentMethods();

      expect(methods.length).toBe(1);
      expect(methods[0].id).toBe(MockPayment.id);
    });
  });

  describe('getPaymentMethod', () => {
    it('gets payment method by id', async () => {
      nock(global.REST_URL)
        .get(`${PaymentAPI.URL.PAYMENTS}/${MockPayment.id}`)
        .query(true)
        .reply(200, JSON.stringify({payment_method: MockPayment}));

      const method = await global.client.rest.payment.getPaymentMethod(MockPayment.id);

      expect(method).toBeDefined();
      expect(method.id).toBe(MockPayment.id);
    });
  });
});
