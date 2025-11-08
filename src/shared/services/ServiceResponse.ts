export interface ServiceResponse {
  status: number;
  message: string;
}

export interface ServiceSuccessResponse<T = any> extends ServiceResponse {
  data: T;
}

export interface ServiceErrorResponse extends ServiceResponse {
  data: null;
  error: any;
}

export const logServiceError = (error: ServiceErrorResponse): void => {
  console.log('[Service Error]', {
    status: error.status,
    message: error.message,
    error: error.error
  });
};

export const transformServiceData = <T>(
  response: ServiceSuccessResponse<any> | ServiceErrorResponse,
  transform: (data: any) => T
): ServiceSuccessResponse<T> | ServiceErrorResponse => {
  if ('error' in response) return response;
  return {
    data: transform(response.data),
    status: response.status,
    message: response.message,
  };
};
