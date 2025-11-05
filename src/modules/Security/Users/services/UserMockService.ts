import { ServiceManager } from '@/shared/services/ServiceManager';
import { IUserService } from './IUserService';
import { ServiceData, createServiceData } from '@/shared/services/IBaseService';
import { UserModel } from '../models/UserModel';
import { MOCK_USERS_WITH_ROLES } from '../data/mockUsersWithRoles';

/**
 * Implementación del servicio de usuarios usando datos mock
 *
 * IMPORTANTE:
 * - Hereda de ServiceManager (maneja loading/error automáticamente con Proxy)
 * - NO necesitas try/catch (ServiceManager lo hace automáticamente)
 * - NO necesitas manejar loading (ServiceManager lo hace automáticamente)
 * - Solo escribe la lógica del método
 */
export class UserMockService extends ServiceManager implements IUserService {
  private mockUsers: UserModel[] = [...MOCK_USERS_WITH_ROLES];

  /**
   * Obtiene usuarios desde mock data
   * Simula un delay de red para testing
   *
   * NOTA: El Proxy de ServiceManager envuelve este método automáticamente
   */
  async getUsersByCompany(companyId: number): Promise<ServiceData<UserModel[]>> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Retornar solo datos (ServiceManager maneja loading/try-catch)
    return createServiceData([...this.mockUsers]);
  }
}
