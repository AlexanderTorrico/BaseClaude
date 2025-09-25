import axios, { AxiosInstance, AxiosResponse } from 'axios';

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