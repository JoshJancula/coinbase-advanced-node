import axios from 'axios';
import {TransactionInformation} from '../payload';
import {TransactionAPI} from '../transaction';
import {formatPaginationIntoParams, SharedRequestService} from './shared-request';

export const mockAllTransactions = {
  data: [
    {
      amount: {
        amount: '486.34313725',
        currency: 'BTC',
      },
      buy: {
        id: '9e14d574-30fa-5d85-b02c-6be0d851d61d',
        resource: 'buy',
        resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/buys/9e14d574-30fa-5d85-b02c-6be0d851d61d',
      },
      created_at: '2015-03-26T23:44:08-07:00',
      description: null,
      details: {
        subtitle: 'using Capital One Bank',
        title: 'Bought bitcoin',
      },
      id: '4117f7d6-5694-5b36-bc8f-847509850ea4',
      native_amount: {
        amount: '4863.43',
        currency: 'USD',
      },
      resource: 'transaction',
      resource_path:
        '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/4117f7d6-5694-5b36-bc8f-847509850ea4',
      status: 'pending',
      type: 'buy',
      updated_at: '2015-03-26T23:44:08-07:00',
    },
    {
      amount: {
        amount: '0.10000000',
        currency: 'BTC',
      },
      created_at: '2015-03-24T18:32:35-07:00',
      description: '',
      details: {
        subtitle: 'from rb@coinbase.com',
        title: 'Requested bitcoin',
      },
      id: '005e55d1-f23a-5d1e-80a4-72943682c055',
      native_amount: {
        amount: '1.00',
        currency: 'USD',
      },
      resource: 'transaction',
      resource_path:
        '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/005e55d1-f23a-5d1e-80a4-72943682c055',
      status: 'pending',
      to: {
        email: 'rb@coinbase.com',
        resource: 'email',
      },
      type: 'request',
      updated_at: '2015-01-31T20:49:02Z',
    },
    {
      amount: {
        amount: '-5.00000000',
        currency: 'BTC',
      },
      created_at: '2015-03-12T15:51:38-07:00',
      description: '',
      details: {
        subtitle: 'to Secondary Account',
        title: 'Transfered bitcoin',
      },
      id: 'ff01bbc6-c4ad-59e1-9601-e87b5b709458',
      native_amount: {
        amount: '-50.00',
        currency: 'USD',
      },
      resource: 'transaction',
      resource_path:
        '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/ff01bbc6-c4ad-59e1-9601-e87b5b709458',
      status: 'completed',
      to: {
        id: '58542935-67b5-56e1-a3f9-42686e07fa40',
        resource: 'account',
        resource_path: '/v2/accounts/58542935-67b5-56e1-a3f9-42686e07fa40',
      },
      type: 'transfer',
      updated_at: '2015-01-31T20:49:02Z',
    },
    {
      amount: {
        amount: '-0.00100000',
        currency: 'BTC',
      },
      created_at: '2015-03-11T13:13:35-07:00',
      description: null,
      details: {
        subtitle: 'to User 2',
        title: 'Send bitcoin',
      },
      id: '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
      native_amount: {
        amount: '-0.01',
        currency: 'USD',
      },
      network: {
        name: 'bitcoin',
        status: 'off_blockchain',
      },
      resource: 'transaction',
      resource_path:
        '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
      status: 'completed',
      to: {
        id: 'a6b4c2df-a62c-5d68-822a-dd4e2102e703',
        resource: 'user',
        resource_path: '/v2/users/a6b4c2df-a62c-5d68-822a-dd4e2102e703',
      },
      type: 'send',
      updated_at: '2015-03-26T15:55:43-07:00',
    },
  ],
  pagination: {
    ending_before: '2bbf394c-193b-5b2a-9155-88kjg7g78',
    limit: 25,
    next_uri: null,
    order: 'desc',
    previous_uri: null,
    starting_after: null,
  },
};

describe('formatPaginationIntoParams', () => {
  it('should return pagination with limit if none provided', () => {
    const params = formatPaginationIntoParams(undefined, false);
    expect((params as any).limit).toBe(250);
  });
});

describe('SharedRequestService', () => {
  const accountId = '2bbf394c-193b-5b2a-9155-3b4732659ede';
  const transactionID = '57ffb4ae-0c59-5430-bcd3-3f98f797a66c';

  const ax = axios.create({
    timeout: 50_000,
  });
  const service = new SharedRequestService(ax, TransactionAPI.SHARED_REF);

  describe('queryAll', async () => {
    it('returns paginated data', async () => {
      const spy = spyOn(ax, 'get').and.resolveTo({data: mockAllTransactions});
      const data = await service.queryAll(accountId, {limit: 100});
      expect(data.pagination.before).toBe(mockAllTransactions.pagination.ending_before);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', async () => {
    it('get items by id', async () => {
      const spy = spyOn(ax, 'get').and.resolveTo({data: {data: mockAllTransactions.data[0]}});
      const data = await service.getById<TransactionInformation>(accountId, transactionID);
      expect(data.id).toBe(mockAllTransactions.data[0].id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
