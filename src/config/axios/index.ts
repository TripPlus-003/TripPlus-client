import { createRequest } from './request';
import { getToken } from './helpers';

export const request = createRequest({
  baseURL: process.env.BASE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const requestWithAuth = createRequest(
  {
    baseURL: process.env.BASE_API_URL,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    requestInterceptors: (config) => {
      let handleConfig = { ...config };
      handleConfig.headers.Authorization = `Bearer ${getToken()}`;
      return handleConfig;
    }
  }
);
