import { UserModel } from '../models/UserModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ServiceResponse } from '@/shared/services/ServiceResponse';

/**
 * Interfaz del servicio de usuarios
 * Todos los métodos retornan ServiceResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IUserService {
  /**
   * Obtiene usuarios por ID de compañía
   * @returns {status: 200, message: 'Success', data: UserModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getUsersByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ServiceResponse<UserModel[]>>;
}
