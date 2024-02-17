import {Coinbase} from '..';
import 'dotenv-defaults/config';

export function initClient(): Coinbase {
  if (process.env.COINBASE_API_KEY !== '' || process.env.CLOUD_API_KEY_NAME !== '') {
    return new Coinbase({
      apiKey: process.env.COINBASE_API_KEY!,
      apiSecret: process.env.COINBASE_API_SECRET!,
      cloudApiKeyName: process.env.CLOUD_API_KEY_NAME,
      cloudApiSecret: process.env.CLOUD_API_KEY_SECRET,
    });
  }
  console.info('Using Coinbase without API key...');
  return new Coinbase();
}
