import { CreatePageModel } from '../models/CreatePageModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de CreatePage
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface ICreatePageService {
  /**
   * Obtiene todos los createpages
   * @returns {status: 200, message: 'Success', data: CreatePageModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<CreatePageModel[]>>;
}
