import { request } from '@/config/axios';

interface SignupBody {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export function apiPostLogin(data: LoginInterface.FormInputs) {
  return request.post<ApiAuth.UserInfo>('/auth/login', data);
}

export function apiPostSignup(data: SignupBody) {
  return request.post<ApiAuth.UserInfo>('/auth/signup', data);
}
