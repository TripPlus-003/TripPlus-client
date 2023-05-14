import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios';
import type { RequestInterceptor } from './types';
import { handleAxiosError } from '@/utils';

export default class CustomAxiosInstance {
  instance: AxiosInstance;
  interceptorsObj: RequestInterceptor<
    AxiosResponse,
    Service.FailedResult
  > | null;

  constructor(
    axiosConfig: AxiosRequestConfig,
    interceptorsObj?: RequestInterceptor<AxiosResponse, Service.FailedResult>
  ) {
    this.instance = axios.create(axiosConfig);
    this.interceptorsObj = interceptorsObj || null;
    this.setInterceptor();
  }

  setInterceptor() {
    // global request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        return config;
      },
      (axiosError: AxiosError<Service.FailedResult>) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data;
      },
      (axiosError: AxiosError<Service.FailedResult>) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      }
    );
  }
}
