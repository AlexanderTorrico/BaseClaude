import { ServiceManager } from '@/shared/services/ServiceManager';
import { IUserService } from './IUserService';
import { ServiceData, createServiceData } from '@/shared/services/IBaseService';
import { UserModel } from '../models/UserModel';
import { getUsersByCompanyCall } from './userApiCalls';
import { adaptUsersArrayToUserModels } from '../adapters/userAdapter';
import { createAuthenticatedCall } from '@/services/httpService';
import { ApiResponse } from '@/pages/Authentication/models';

/**
 * Implementación del servicio de usuarios usando API real
 *
 * IMPORTANTE:
 * - Hereda de ServiceManager (maneja loading/error automáticamente con Proxy)
 * - NO necesitas try/catch (ServiceManager lo hace automáticamente)
 * - NO necesitas manejar loading (ServiceManager lo hace automáticamente)
 * - Solo escribe la lógica del método
 * - Si hay error, simplemente déjalo lanzar (ServiceManager lo captura)
 */
export class UserApiService extends ServiceManager implements IUserService {
  /**
   * NOTA: El Proxy de ServiceManager envuelve este método automáticamente
   * Si la petición falla, el error se loggea automáticamente
   */
  async getUsersByCompany(companyId: number): Promise<ServiceData<UserModel[]>> {
    // Llamada a la API (si falla, ServiceManager captura el error)
    const { call } = createAuthenticatedCall<ApiResponse<any>>(
        'GET', `/rrhh/by_company_id/${companyId}`
      );
    const response = await call;

    // Adaptar datos de API a modelo UI
    const users = adaptUsersArrayToUserModels(response.data.data ?? []);

    // Retornar solo datos (ServiceManager maneja loading/try-catch)
    return createServiceData(users);
  }
}
