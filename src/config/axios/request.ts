import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestInterceptor } from './types';

import CustomAxiosInstance from './instance';

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RequestParam {
  url: string;
  method?: RequestMethod;
  data?: unknown;
  axiosConfig?: AxiosRequestConfig;
}

export function createRequest(
  config: AxiosRequestConfig,
  interceptorsObj?: RequestInterceptor<AxiosResponse, Service.FailedResult>
) {
  const customInstance = new CustomAxiosInstance(config, interceptorsObj);

  async function asyncRequest<T>(
    param: RequestParam
  ): Promise<Service.RequestResult<T>> {
    const { url } = param;
    const method = param.method || 'get';
    const { instance } = customInstance;

    const res = (await getRequestResponse({
      instance,
      method,
      url,
      data: param.data,
      config: param.axiosConfig
    })) as Service.RequestResult<T>;

    return res;
  }

  /**
   *
   * @param url 請求網址
   * @param config request body
   * @param config axios 設定
   */
  function get<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'get', axiosConfig: config });
  }

  /**
   *
   * @param url 請求網址
   * @param config request body
   * @param config axios 設定
   */
  function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'post', data, axiosConfig: config });
  }

  /**
   *
   * @param url 請求網址
   * @param config request body
   * @param config axios 設定
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'put', data, axiosConfig: config });
  }

  /**
   *
   * @param url 請求網址
   * @param config request body
   * @param config axios 設定
   */
  function patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'patch', data, axiosConfig: config });
  }

  /**
   *
   * @param url 請求網址
   * @param config request body
   * @param config axios 設定
   */
  function handleDelete<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'delete', axiosConfig: config });
  }

  return {
    get,
    post,
    put,
    patch,
    delete: handleDelete
  };
}

async function getRequestResponse(params: {
  instance: AxiosInstance;
  method: RequestMethod;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
}) {
  const { instance, method, url, data, config } = params;

  let res: any;
  if (method === 'get' || method === 'delete') {
    res = await instance[method](url, config);
  } else {
    res = await instance[method](url, data, config);
  }
  return res;
}
