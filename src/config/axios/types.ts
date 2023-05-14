import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

export interface RequestInterceptor<T, TR> {
  requestInterceptors?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: AxiosError<TR>) => AxiosError<TR>;
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: AxiosError<TR>) => AxiosError<TR>;
}
