import nock from 'nock';
import {NewOrder, OrderAPI, OrderStatus} from './OrderAPI';
import {OrderSide} from '../payload';
import {AxiosError} from 'axios';

describe('OrderAPI', () => {
  afterEach(() => nock.cleanAll());

  describe('placeOrder', () => {
    it('places buy orders', async () => {
      nock(global.REST_URL)
        .post(OrderAPI.URL.ORDERS)
        .query(true)
        .reply((_uri, body) => {
          const newOrder: NewOrder = typeof body === 'string' ? JSON.parse(body) : body;

          return [
            200,
            JSON.stringify({
              order_configuration: {
                market_market_ioc: {
                  base_size: '0.001',
                  quote_size: '10.00',
                },
              },
              order_id: '089797696987-97687687-96867576576',
              success: true,
              success_response: {
                client_order_id: newOrder.client_order_id,
                order_id: '089797696987-97687687-968675765760',
                product_id: 'BTC-USD',
                side: 'BUY',
              },
            }),
          ];
        });

      const placedOrder = await global.client.rest.order.placeOrder({
        client_order_id: '224242-23232-23232323',
        order_configuration: {
          limit_limit_gtc: {
            base_size: '.001',
            limit_price: '16400',
            post_only: false,
          },
        },
        product_id: 'BTC-USD',
        side: OrderSide.BUY,
      });

      expect(placedOrder.order_id).toBe('089797696987-97687687-96867576576');
      expect(placedOrder.success).toBe(true);
    });
  });

  describe('getOrders', () => {
    it('returns list of open orders', async () => {
      nock(global.REST_URL)
        .get(OrderAPI.URL.ORDERS + '/historical/batch')
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            cursor: '789100',
            has_next: true,
            orders: [
              {
                average_filled_price: '50',
                cancel_message: 'string',
                client_order_id: '11111-000000-000000',
                completion_percentage: '50',
                created_time: '2021-05-31T09:59:59Z',
                fee: 'string',
                filled_size: '0.001',
                filled_value: '10000',
                number_of_fills: '2',
                order_configuration: {
                  limit_limit_gtc: {
                    base_size: '0.001',
                    limit_price: '10000.00',
                    post_only: false,
                  },
                },
                order_id: '0000-000000-000000',
                order_type: 'UNKNOWN_ORDER_TYPE',
                pending_cancel: true,
                product_id: 'BTC-USD',
                product_type: 'SPOT',
                reject_message: 'string',
                reject_reason: 'REJECT_REASON_UNSPECIFIED',
                settled: 'boolean',
                side: 'BUY',
                size_in_quote: false,
                size_inclusive_of_fees: false,
                status: 'OPEN',
                time_in_force: 'UNKNOWN_TIME_IN_FORCE',
                total_fees: '5.00',
                total_value_after_fees: 'string',
                trigger_status: 'UNKNOWN_TRIGGER_STATUS',
                user_id: '2222-000000-000000',
              },
            ],
            sequence: 'string',
          });
        });

      const openOrders = await global.client.rest.order.getOrders();

      expect(openOrders.data.length).toBe(1);
      expect(openOrders.data[0].side).toBe(OrderSide.BUY);
    });

    it('accepts a list of different order statuses', async () => {
      nock(global.REST_URL)
        .get(OrderAPI.URL.ORDERS + '/historical/batch')
        .query(true)
        .reply(200, (_uri: string) => {
          return JSON.stringify({
            cursor: '789100',
            has_next: true,
            orders: [
              {
                average_filled_price: '50',
                cancel_message: 'string',
                client_order_id: '11111-000000-000000',
                completion_percentage: '50',
                created_time: '2021-05-31T09:59:59Z',
                fee: 'string',
                filled_size: '0.001',
                filled_value: '10000',
                number_of_fills: '2',
                order_configuration: {
                  limit_limit_gtc: {
                    base_size: '0.001',
                    limit_price: '10000.00',
                    post_only: false,
                  },
                },
                order_id: '0000-000000-000000',
                order_type: 'UNKNOWN_ORDER_TYPE',
                pending_cancel: true,
                product_id: 'BTC-USD',
                product_type: 'SPOT',
                reject_message: 'string',
                reject_reason: 'REJECT_REASON_UNSPECIFIED',
                settled: 'boolean',
                side: 'UNKNOWN_ORDER_SIDE',
                size_in_quote: false,
                size_inclusive_of_fees: false,
                status: 'OPEN',
                time_in_force: 'UNKNOWN_TIME_IN_FORCE',
                total_fees: '5.00',
                total_value_after_fees: 'string',
                trigger_status: 'UNKNOWN_TRIGGER_STATUS',
                user_id: '2222-000000-000000',
              },
            ],
          });
        });

      const openOrders = await global.client.rest.order.getOrders({
        order_status: [OrderStatus.OPEN, OrderStatus.PENDING],
      });

      expect(openOrders.data.length).toBe(1);
    });
  });

  describe('getOrder', () => {
    it('returns correct order information', async () => {
      const orderId = '0000-000000-000000';

      nock(global.REST_URL)
        .get(`${OrderAPI.URL.ORDERS}/historical/${orderId}`)
        .query(true)
        .reply(
          200,
          JSON.stringify({
            average_filled_price: '50',
            cancel_message: 'string',
            client_order_id: '11111-000000-000000',
            completion_percentage: '50',
            created_time: '2021-05-31T09:59:59Z',
            fee: 'string',
            filled_size: '0.001',
            filled_value: '10000',
            number_of_fills: '2',
            order_configuration: {
              limit_limit_gtc: {
                base_size: '0.001',
                limit_price: '10000.00',
                post_only: false,
              },
            },
            order_id: '0000-000000-000000',
            order_type: 'UNKNOWN_ORDER_TYPE',
            pending_cancel: true,
            product_id: 'BTC-USD',
            product_type: 'SPOT',
            reject_message: 'string',
            reject_reason: 'REJECT_REASON_UNSPECIFIED',
            settled: 'boolean',
            side: 'UNKNOWN_ORDER_SIDE',
            size_in_quote: false,
            size_inclusive_of_fees: false,
            status: 'OPEN',
            time_in_force: 'UNKNOWN_TIME_IN_FORCE',
            total_fees: '5.00',
            total_value_after_fees: 'string',
            trigger_status: 'UNKNOWN_TRIGGER_STATUS',
            user_id: '2222-000000-000000',
          })
        );

      const order = await global.client.rest.order.getOrder('0000-000000-000000');
      expect(order?.order_id).toBe('0000-000000-000000');
    });

    it('returns null if an order cannot be found', async () => {
      nock(global.REST_URL).get(`${OrderAPI.URL.ORDERS}/historical/123`).query(true).reply(404);

      const order = await global.client.rest.order.getOrder('123');

      expect(order).toEqual(null);
    });

    it('rethrows errors with status code other than 404', async () => {
      nock(global.REST_URL).get(`${OrderAPI.URL.ORDERS}/historical/123`).query(true).reply(403);

      try {
        await global.client.rest.order.getOrder('123');
      } catch (error) {
        expect((error as AxiosError).response!.status).toBe(403);
      }
    });
  });

  describe('cancelOrder', () => {
    it('correctly cancels a specific order', async () => {
      nock(global.REST_URL)
        .post(`${OrderAPI.URL.ORDERS}/batch_cancel`)
        .query(true)
        .reply(200, JSON.stringify({results: [{order_id: '8eba9e7b-08d6-4667-90ca-6db445d743c1', success: true}]}));

      const o = await global.client.rest.order.cancelOrder('8eba9e7b-08d6-4667-90ca-6db445d743c1');
      expect(o.order_id).toEqual('8eba9e7b-08d6-4667-90ca-6db445d743c1');
    });
  });

  describe('editOrder', () => {
    it('should edit an order', async () => {
      nock(global.REST_URL)
        .post(`${OrderAPI.URL.ORDERS}/edit`)
        .query(true)
        .reply(200, JSON.stringify({success: true}));

      const o = await global.client.rest.order.editOrder({
        order_id: 'xxxxxxxxxxxx',
        price: '10.00',
        size: '1',
      });
      expect(o.success).toBe(true);
    });
  });

  describe('closePosition', () => {
    it('should edit an order', async () => {
      nock(global.REST_URL)
        .post(`${OrderAPI.URL.ORDERS}/close_position`)
        .query(true)
        .reply(
          200,
          JSON.stringify({
            success: true,
            success_response: {
              client_order_id: 'xxxxxxxxxxxxx',
              order_id: 'yyyyyyyyyyyy',
              product_id: 'BTC-US,D',
              side: 'BUY',
            },
          })
        );

      const o = await global.client.rest.order.closePosition({
        client_order_id: 'xxxxxxxxxxxxx',
        product_id: 'BTC-USD',
        size: '.001',
      });

      expect(o.success).toBe(true);
    });
  });
});
