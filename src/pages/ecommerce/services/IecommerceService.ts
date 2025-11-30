import { ecommerceModel } from '../models/ecommerceModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de ecommerce
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IecommerceService {
  /**
   * Obtiene todos los ecommerces
   * @returns {status: 200, message: 'Success', data: ecommerceModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<ecommerceModel[]>>;
}
