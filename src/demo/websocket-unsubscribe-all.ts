import {initClient} from './init-client';
import {WebSocketChannelName, WebSocketEvent} from '..';

const client = initClient();

const channels = [
  {
    channel: WebSocketChannelName.LEVEL2,
    product_ids: ['ETH-USD', 'BTC-USD'],
  },
  {
    channel: WebSocketChannelName.TICKER,
    product_ids: ['ETH-USD', 'BTC-USD'],
  },
];

client.ws.on(WebSocketEvent.ON_OPEN, async () => {
  await client.ws.subscribe(channels);
});

client.ws.on(WebSocketEvent.ON_SUBSCRIPTION_UPDATE, async subscriptions => {
  const subscriptionCount = subscriptions.channels.length;
  const uniqueProductIds = new Set();
  const productIds = subscriptions.channels.map(subscription => subscription.product_ids);
  productIds.forEach(ids => (ids || []).forEach(id => uniqueProductIds.add(id)));

  console.info(
    `We have now "${subscriptionCount}" subscriptions for "${uniqueProductIds.size}" different products.`,
    JSON.stringify(subscriptions, null, 2)
  );

  switch (subscriptionCount) {
    case 0:
      console.info(`No more subscriptions. We will disconnect.`);
      client.ws.disconnect();
      break;
    case 1:
      console.info(`We will unsubscribe from "${WebSocketChannelName.LEVEL2}" channel...`);
      await client.ws.unsubscribe(WebSocketChannelName.LEVEL2);
      break;
    case 3:
      console.info(`We will unsubscribe from "${WebSocketChannelName.TICKER}" channel...`);
      await client.ws.unsubscribe(WebSocketChannelName.TICKER);
      break;
  }
});

client.ws.connect();
