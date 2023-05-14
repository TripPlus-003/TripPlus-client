// import { localStg } from '@/utils';
import { useAuthStore } from '@/store';

export function getToken() {
  return useAuthStore.getState().userInfo?.token || '';
}
