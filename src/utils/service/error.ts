import type { AxiosError } from 'axios';

export function handleAxiosError(axiosError: AxiosError<Service.FailedResult>) {
  const error: Service.FailedResult = {
    status: 'Error',
    message: ''
  };
  if (axiosError.message === 'Network Error') {
    Object.assign(error, { message: '網路不可用' });
  }
  if (!!axiosError.response) {
    Object.assign(error, { message: axiosError.response.data.message });
  }

  return error;
}
