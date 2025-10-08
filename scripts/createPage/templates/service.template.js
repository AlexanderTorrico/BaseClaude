export default (moduleName) => `import { createAuthenticatedCall } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Servicio de ${moduleName}
 */
export const get${moduleName}Call = (): AxiosCallModel<ApiResponse<any>> => {
  return createAuthenticatedCall<ApiResponse<any>>(
    'GET',
    '/${moduleName.toLowerCase()}'
  );
};
`;
