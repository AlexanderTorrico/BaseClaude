import { createApiInstance, loadAbort } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../models';

// Create API instance using the generic HTTP service
const api = createApiInstance();

// Authentication API functions - using AxiosCallModel pattern
export const login = (credentials: LoginRequest): AxiosCallModel<ApiResponse<AuthResponse>> => {
  const controller = loadAbort();
  return {
    call: api.post<ApiResponse<AuthResponse>>('/login', credentials, { signal: controller.signal }),
    controller
  };
};

export const register = (userData: RegisterRequest): AxiosCallModel<ApiResponse<AuthResponse>> => {
  const controller = loadAbort();
  return {
    call: api.post<ApiResponse<AuthResponse>>('/auth/register', userData, { signal: controller.signal }),
    controller
  };
};

export const forgotPassword = (email: string): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();
  return {
    call: api.post<ApiResponse>('/auth/forgot-password', { email }, { signal: controller.signal }),
    controller
  };
};

export const getProfile = (): AxiosCallModel<ApiResponse<any>> => {
  const controller = loadAbort();
  return {
    call: api.get<ApiResponse<any>>('/auth/profile', { signal: controller.signal }),
    controller
  };
};

export const updateProfile = (data: Partial<any>): AxiosCallModel<ApiResponse<any>> => {
  const controller = loadAbort();
  return {
    call: api.put<ApiResponse<any>>('/auth/profile', data, { signal: controller.signal }),
    controller
  };
};

export const refreshToken = (refreshToken: string): AxiosCallModel<ApiResponse<AuthResponse>> => {
  const controller = loadAbort();
  return {
    call: api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }, { signal: controller.signal }),
    controller
  };
};

export const logout = (): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();
  return {
    call: api.post<ApiResponse>('/auth/logout', {}, { signal: controller.signal }),
    controller
  };
};