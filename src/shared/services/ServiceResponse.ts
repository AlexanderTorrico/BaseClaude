export interface BaseServiceResponse {
  status: number;
  message: string;
}

export interface ResponseSuccessService<T = any> extends BaseServiceResponse {
  data: T;
}

export interface ResponseErrorService extends BaseServiceResponse {
  data: null;
  error: any;
}

export const logServiceError = (error: ResponseErrorService): void => {
  console.log('[Service Error]', {
    status: error.status,
    message: error.message,
    error: error.error
  });
};

export const wrapperData = <T>(
  response: ResponseSuccessService<any> | ResponseErrorService,
  adapter: (data: any) => T
): ResponseSuccessService<T> | ResponseErrorService => {
  if ('error' in response) return response;
  return {
    data: adapter(response.data),
    status: response.status,
    message: response.message,
  };
};

export interface ServiceResponse<T> {
  loading: boolean;
  data?: T;
  error?: string;
  success: boolean;
}

export const createSuccessResponse = <T>(data: T): ServiceResponse<T> => ({
  loading: false,
  data,
  success: true
});

export const createErrorResponse = <T>(error: string): ServiceResponse<T> => ({
  loading: false,
  error,
  success: false
});

export const createLoadingResponse = <T>(): ServiceResponse<T> => ({
  loading: true,
  success: false
});
