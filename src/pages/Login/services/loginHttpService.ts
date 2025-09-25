// ==========================================
// LOGIN HTTP SERVICE - FUNCTIONAL APPROACH
// ==========================================

import { createApiInstance, loadAbort } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import type { LoginCredentials } from '../models';

// Create API instance
const api = createApiInstance();

// API Response interfaces - Estructura de tu backend
interface ApiResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    modules: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      path: string;
      color: string;
      img: string;
      weight_for_edit: number;
      type: string | null;
      module_company_id: number;
      with_web_editor: number;
      steps: any[];
    }>;
    roles: any[];
    direct_permissions: any[];
    data: {
      id: number;
      name: string;
      last_name: string;
      last_name_mother: string;
      email: string;
      email_verified_at: string | null;
      token: string | null;
      privilege: string;
      phone: string | null;
      logo: string | null;
      language: string;
      status: number;
      user_id: number | null;
      created_at: string;
      updated_at: string;
    };
  };
}

// Login HTTP service
export const loginService = (
  credentials: LoginCredentials
): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>('/login', {
      email: credentials.email,
      password: credentials.password,
      remember_me: credentials.rememberMe
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Social login service
export const socialLoginService = (
  provider: string,
  token: string
): AxiosCallModel<ApiResponse<LoginApiResponse>> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse<LoginApiResponse>>(`/auth/social/${provider}`, {
      access_token: token
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Logout service
export const logoutService = (): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>('/auth/logout', {}, {
      signal: controller.signal
    }),
    controller
  };
};

// Refresh token service
export const refreshTokenService = (
  refreshToken: string
): AxiosCallModel<ApiResponse<{ access_token: string; expires_in: number }>> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse<{ access_token: string; expires_in: number }>>('/auth/refresh', {
      refresh_token: refreshToken
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Validate session service
export const validateSessionService = (): AxiosCallModel<ApiResponse<{ valid: boolean }>> => {
  const controller = loadAbort();

  return {
    call: api.get<ApiResponse<{ valid: boolean }>>('/auth/validate', {
      signal: controller.signal
    }),
    controller
  };
};