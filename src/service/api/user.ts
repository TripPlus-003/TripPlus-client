import { request, requestWithAuth } from '@/config/axios';
import { AxiosRequestConfig } from 'axios';

export function apiGetUserAccount(config?: AxiosRequestConfig) {
  return request.get<ApiAuth.Account>('/user/account', config);
}

export function apiPatchUserAccount(
  data: ApiAuth.Account,
  config?: AxiosRequestConfig
) {
  return request.patch<ApiAuth.Account>('/user/account', data, config);
}
