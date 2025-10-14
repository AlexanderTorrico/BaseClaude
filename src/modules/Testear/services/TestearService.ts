import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Servicio de Testear
 */
export const getTestearCall = (): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    '/testear'
  );
};
