import {Coinbase} from '..';
import 'dotenv-defaults/config';

export function initClient(): Coinbase {
  if (process.env.COINBASE_API_KEY !== '') {
    return new Coinbase({
      apiKey: process.env.COINBASE_API_KEY!,
      apiSecret: process.env.COINBASE_API_SECRET!,
      ctApiKeyName: process.env.CLOUD_API_KEY_NAME,
      ctApiSecret: process.env.CLOUD_API_KEY_SECRET,
    });
  }
  console.info('Using Coinbase without API key...');
  return new Coinbase();
}
