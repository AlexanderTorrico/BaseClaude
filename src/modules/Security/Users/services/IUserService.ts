import { IBaseService, ServiceData } from '@/shared/services/IBaseService';
import { UserModel } from '../models/UserModel';

/**
 * Interface para el servicio de usuarios
 *
 * IMPORTANTE:
 * - Todos los métodos deben retornar ServiceData<T>
 * - NO incluir loading en la respuesta (lo maneja ServiceWrapper)
 * - ServiceWrapper se encarga de try/catch y logs
 */
export interface IUserService extends IBaseService {
  /**
   * Obtiene usuarios por company_id
   * @param companyId - ID de la compañía
   * @returns Promise con ServiceData<UserModel[]>
   */
  getUsersByCompany(companyId: number): Promise<ServiceData<UserModel[]>>;
}
