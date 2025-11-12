import { CompanyModel, Branch } from '../models/CompanyModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de Company
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface ICompanyService {
  /**
   * Obtiene la información de la compañía
   * @returns {status: 200, message: 'Success', data: CompanyModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  getCompany(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>>;

  /**
   * Actualiza la información de la compañía
   * @param data - Datos de la compañía a actualizar
   * @returns {status: 200, message: 'Success', data: CompanyModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  updateCompany(
    data: Partial<CompanyModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CompanyModel>>;

  /**
   * Obtiene las sucursales de la compañía
   * @returns {status: 200, message: 'Success', data: Branch[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getBranches(setLoading?: SetStateFn): Promise<ApiResponse<Branch[]>>;

  /**
   * Crea una nueva sucursal
   * @param data - Datos de la sucursal a crear
   * @returns {status: 200, message: 'Success', data: Branch} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  createBranch(data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>, setLoading?: SetStateFn): Promise<ApiResponse<Branch>>;

  /**
   * Actualiza una sucursal existente
   * @param id - ID de la sucursal
   * @param data - Datos a actualizar
   * @returns {status: 200, message: 'Success', data: Branch} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  updateBranch(
    id: number,
    data: Partial<Branch>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<Branch>>;

  /**
   * Elimina una sucursal
   * @param id - ID de la sucursal a eliminar
   * @returns {status: 200, message: 'Success', data: true} en éxito
   * @returns {status: 4xx/5xx, message: string, data: false} en error
   */
  deleteBranch(id: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>>;
}
