import { createApiInstance, handleRequest } from '@/services/httpService';
import { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../models';

// Create API instance using the generic HTTP service
const api = createApiInstance();

// Authentication API functions - maintaining original structure
export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  return handleRequest(
    api.post<ApiResponse<AuthResponse>>('/login', credentials)
  );
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  return handleRequest(
    api.post<ApiResponse<AuthResponse>>('/auth/register', userData)
  );
};

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  return handleRequest(
    api.post<ApiResponse>('/auth/forgot-password', { email })
  );
};

export const getProfile = async (): Promise<ApiResponse<any>> => {
  return handleRequest(
    api.get<ApiResponse<any>>('/auth/profile')
  );
};

export const updateProfile = async (data: Partial<any>): Promise<ApiResponse<any>> => {
  return handleRequest(
    api.put<ApiResponse<any>>('/auth/profile', data)
  );
};

export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
  return handleRequest(
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken })
  );
};

export const logout = async (): Promise<ApiResponse> => {
  return handleRequest(
    api.post<ApiResponse>('/auth/logout')
  );
};