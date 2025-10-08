import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosCallModel } from '@/models/axiosCallModel';

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
}

/**
 * Create a configured axios instance
 */
export const createApiInstance = (config?: HttpConfig): AxiosInstance => {
  const baseURL = config?.baseURL ||
                 import.meta.env.VITE_APP_API_URL ||
                 import.meta.env.VITE_API_BASE_URL;

  return axios.create({
    baseURL,
    timeout: config?.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Generic request handler for consistent error handling
 */
export const handleRequest = async <T>(
  request: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Request failed',
      status: error.response?.status || 500,
    };
  }
};

/**
 * Creates AbortController for request cancellation
 */
export const loadAbort = (): AbortController => {
  return new AbortController();
};

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Create authenticated API call (with token in headers)
 */
export const createAuthenticatedCall = <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): AxiosCallModel<T> => {
  const controller = loadAbort();
  const api = createApiInstance();
  const token = getAuthToken();

  const headers: any = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestConfig: AxiosRequestConfig = {
    ...config,
    headers,
    signal: controller.signal,
  };

  let call: Promise<AxiosResponse<T>>;

  switch (method) {
    case 'GET':
      call = api.get<T>(url, requestConfig);
      break;
    case 'POST':
      call = api.post<T>(url, data, requestConfig);
      break;
    case 'PUT':
      call = api.put<T>(url, data, requestConfig);
      break;
    case 'DELETE':
      call = api.delete<T>(url, requestConfig);
      break;
    case 'PATCH':
      call = api.patch<T>(url, data, requestConfig);
      break;
  }

  return { call, controller };
};

/**
 * Create public API call (without authentication)
 */
export const createPublicCall = <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): AxiosCallModel<T> => {
  const controller = loadAbort();
  const api = createApiInstance();

  const requestConfig: AxiosRequestConfig = {
    ...config,
    signal: controller.signal,
  };

  let call: Promise<AxiosResponse<T>>;

  switch (method) {
    case 'GET':
      call = api.get<T>(url, requestConfig);
      break;
    case 'POST':
      call = api.post<T>(url, data, requestConfig);
      break;
    case 'PUT':
      call = api.put<T>(url, data, requestConfig);
      break;
    case 'DELETE':
      call = api.delete<T>(url, requestConfig);
      break;
    case 'PATCH':
      call = api.patch<T>(url, data, requestConfig);
      break;
  }

  return { call, controller };
};