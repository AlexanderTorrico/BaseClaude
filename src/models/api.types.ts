import { ApiResponse, ApiError } from './common.types';

export interface IBackendService {
  login(credentials: { email: string; password: string }): Promise<ApiResponse>;
  register(userData: { name: string; email: string; password: string }): Promise<ApiResponse>;
  forgotPassword(email: string): Promise<ApiResponse>;
  getProfile(): Promise<ApiResponse>;
  updateProfile(data: any): Promise<ApiResponse>;
  getUsers(filters?: any): Promise<ApiResponse>;
  createUser(userData: any): Promise<ApiResponse>;
  updateUser(id: string | number, userData: any): Promise<ApiResponse>;
  deleteUser(id: string | number): Promise<ApiResponse>;
}

export enum BackendType {
  FAKE = 'fake',
  REAL = 'real'
}

export interface BackendConfig {
  type: BackendType;
  baseURL?: string;
  timeout?: number;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}