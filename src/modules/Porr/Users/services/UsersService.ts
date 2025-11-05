import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Servicio de Users
 */
export const getUsersCall = (): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    '/users'
  );
};
