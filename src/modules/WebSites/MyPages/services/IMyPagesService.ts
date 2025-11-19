import { MyPagesModel } from '../models/MyPagesModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de MyPages
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IMyPagesService {
  /**
   * Obtiene todos los mypagess
   * @returns {status: 200, message: 'Success', data: MyPagesModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel[]>>;

  /**
   * Actualiza el nombre de una página
   * @param pageId - ID de la página
   * @param newName - Nuevo nombre de la página
   * @returns {status: 200, message: 'Success', data: MyPagesModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  updatePageName(pageId: number, newName: string, setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel | null>>;
}
