import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ResponseSuccessService, ResponseErrorService } from '@/shared/services/ServiceResponse';
import { ISetState } from '@/shared/types/commonTypes';

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
}

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

export const loadAbort = (): AbortController => {
  return new AbortController();
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const executeRequest = async <T>(
  api: AxiosInstance,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  setLoading?: ISetState
): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
  setLoading?.(true);

  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case 'GET':
        response = await api.get<T>(url, config);
        break;
      case 'POST':
        response = await api.post<T>(url, data, config);
        break;
      case 'PUT':
        response = await api.put<T>(url, data, config);
        break;
      case 'DELETE':
        response = await api.delete<T>(url, config);
        break;
      case 'PATCH':
        response = await api.patch<T>(url, data, config);
        break;
    }

    setLoading?.(false);

    return {
      data: response.data,
      status: response.status,
      message: 'Success',
    };
  } catch (error: any) {
    setLoading?.(false);

    return {
      data: null,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Request failed',
      error: error,
    };
  }
};

export const httpRequest = {
  get: async <T>(
    url: string,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    return executeRequest<T>(api, 'GET', url, undefined, config, setLoading);
  },

  post: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    return executeRequest<T>(api, 'POST', url, data, config, setLoading);
  },

  put: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    return executeRequest<T>(api, 'PUT', url, data, config, setLoading);
  },

  patch: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    return executeRequest<T>(api, 'PATCH', url, data, config, setLoading);
  },

  delete: async <T>(
    url: string,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    return executeRequest<T>(api, 'DELETE', url, undefined, config, setLoading);
  },
};

export const httpRequestWithAuth = {
  get: async <T>(
    url: string,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    const token = getAuthToken();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return executeRequest<T>(api, 'GET', url, undefined, requestConfig, setLoading);
  },

  post: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    const token = getAuthToken();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return executeRequest<T>(api, 'POST', url, data, requestConfig, setLoading);
  },

  put: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    const token = getAuthToken();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return executeRequest<T>(api, 'PUT', url, data, requestConfig, setLoading);
  },

  patch: async <T>(
    url: string,
    data: any,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    const token = getAuthToken();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return executeRequest<T>(api, 'PATCH', url, data, requestConfig, setLoading);
  },

  delete: async <T>(
    url: string,
    setLoading?: ISetState,
    config?: AxiosRequestConfig
  ): Promise<ResponseSuccessService<T> | ResponseErrorService> => {
    const api = createApiInstance();
    const token = getAuthToken();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return executeRequest<T>(api, 'DELETE', url, undefined, requestConfig, setLoading);
  },
};

/**
 * @deprecated Use httpRequest or httpRequestWithAuth instead
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
 * @deprecated Use httpRequest instead
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