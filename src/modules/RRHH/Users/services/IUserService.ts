import { UserModel } from '../models/UserModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de usuarios
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IUserService {
  /**
   * Obtiene usuarios por ID de compañía
   * @returns {status: 200, message: 'Success', data: UserModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getUsersByCompany( companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<UserModel[]>>;

  /**
   * Registra un nuevo usuario
   * @param formData - FormData con los campos del usuario (incluye avatar)
   * @param setLoading - Opcional callback para estado de carga
   * @returns {status: 200, message: 'Success', data: UserModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  registerUser(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<UserModel>>;

  /**
   * Actualiza un usuario existente
   * @param formData - FormData con los campos del usuario (incluye id y avatar)
   * La contraseña solo se incluye si el usuario desea cambiarla
   * @param setLoading - Opcional callback para estado de carga
   * @returns {status: 200, message: 'Success', data: UserModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  updateUser(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<UserModel>>;
}
