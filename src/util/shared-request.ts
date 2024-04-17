import {AxiosInstance} from 'axios';
import {NewSIWCTransaction, PaginatedData, Pagination} from '../payload';
import {stringify} from 'qs';

export const serializeParamsArray = (params: any): string => {
  return stringify(params, {arrayFormat: 'repeat', indices: false});
};

export const formatPaginationIntoParams = (pagination: Pagination | undefined, siwc = false, params = {}): Object => {
  if (pagination?.after) {
    const d = siwc ? {starting_after: pagination.after} : {cursor: pagination.after};
    Object.assign(params, d);
  }
  if (pagination?.before) {
    const d = siwc ? {ending_before: pagination.before} : {};
    Object.assign(params, d);
  }
  if (pagination?.limit) {
    Object.assign(params, {limit: pagination.limit});
  } else {
    Object.assign(params, {limit: 250});
  }
  return params;
};

export class SharedRequestService {
  static readonly BASE_URL = '/accounts';

  constructor(private readonly apiClient: AxiosInstance, private readonly operation: string) {}

  async queryAll<T>(account: string, pagination?: Pagination, customPath?: string): Promise<PaginatedData<T>> {
    const resource = customPath || `/accounts/${account}/${this.operation}`;
    let params = {};
    if (pagination) {
      params = formatPaginationIntoParams(pagination, true);
    }
    const response = await this.apiClient.get(resource, {
      params,
    });
    return {
      data: response.data.data,
      pagination: {
        after: response.data.pagination.starting_after || '0',
        before: response.data.pagination.ending_before || '0',
        has_next: response.data.has_next || false,
      },
    };
  }

  async getById<T>(accountId: string, transactionID: string): Promise<T> {
    const resource = `/accounts/${accountId}/${this.operation}/${transactionID}`;
    const response = await this.apiClient.get(resource);
    return response.data.data;
  }

  async createNew<T>(data: NewSIWCTransaction): Promise<T> {
    const resource = `/accounts/${data.accountId?.toString()}/${this.operation}`;
    delete (data as any).accountId;
    const response = await this.apiClient.post(resource, data);
    return response.data.data;
  }

  async commitPending<T>(accountId: string, transactionId: string): Promise<T> {
    const resource = `/accounts/${accountId}/${this.operation}/${transactionId}/commit`;
    const response = await this.apiClient.post(resource, null);
    return response.data.data;
  }
}
