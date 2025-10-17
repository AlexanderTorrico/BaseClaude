import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Servicio de Employes
 */
export const getEmployesCall = (): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    '/employes'
  );
};
