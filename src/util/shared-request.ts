import {AxiosInstance} from 'axios';
import {NewSIWCTransaction, PaginatedData, Pagination, UniversalPagination} from '../payload';
import {stringify} from 'qs';

export const serializeParamsArray = (params: any): string => {
  return stringify(params, {arrayFormat: 'repeat', indices: false});
};

export const formatPaginationIntoParams = (pagination: Pagination | undefined, siwc = false, params = {}): Object => {
  if (pagination?.after || pagination?.cursor) {
    const d = siwc
      ? {starting_after: pagination.after || pagination.cursor}
      : {cursor: pagination.after || pagination.cursor};
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

export const formatPaginationFromResponse = (response: any): UniversalPagination => {
  const pagination = {
    after: response?.data?.pagination?.starting_after || response?.data?.cursor || undefined,
    before: response?.data?.pagination?.ending_before || undefined,
    cursor: response?.data?.cursor || undefined,
    ending_before: response?.data?.pagination?.ending_before || undefined,
    has_next: response?.data?.has_next || !!response?.data?.pagination?.next_uri || false,
    limit: response?.data?.pagination?.limit,
    next_uri: response?.data?.pagination?.next_uri || undefined,
    order: response?.data?.pagination?.order || undefined,
    size: response?.data?.size ? Number(response.data.size) : undefined,
    starting_after: response?.data?.pagination?.starting_after || response.data.cursor || undefined,
  };
  return Object.entries(pagination)
    .filter(([_key, value]) => value !== undefined)
    .reduce((obj, [key, value]) => {
      // @ts-ignore
      obj[key] = value;
      return obj;
    }, {});
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
      pagination: formatPaginationFromResponse(response),
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
