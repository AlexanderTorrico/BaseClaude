import { CompanyModel, BranchModel } from '../models/CompanyModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de Company
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface ICompanyService {
  /**
   * Obtiene todas las compañías
   * @returns {status: 200, message: 'Success', data: CompanyModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel[]>>;

  /**
   * Crea una nueva compañía
   * @param formData - FormData con los datos de la compañía (incluyendo logo)
   * @returns {status: 200, message: 'Success', data: CompanyModel} en éxito
   */
  create(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>>;

  /**
   * Actualiza una compañía existente
   * @param formData - FormData con los datos actualizados
   * @returns {status: 200, message: 'Success', data: CompanyModel} en éxito
   */
  update(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>>;

  /**
   * Elimina una compañía
   * @param id - ID de la compañía
   * @returns {status: 200, message: 'Success', data: null} en éxito
   */
  delete(id: number, setLoading?: SetStateFn): Promise<ApiResponse<null>>;

  /**
   * Agrega una nueva sucursal a una compañía
   * @param companyId - ID de la compañía
   * @param branchData - Datos de la sucursal
   * @returns {status: 200, message: 'Success', data: BranchModel} en éxito
   */
  addBranch(companyId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>>;

  /**
   * Actualiza una sucursal existente
   * @param branchId - ID de la sucursal
   * @param branchData - Datos actualizados
   * @returns {status: 200, message: 'Success', data: BranchModel} en éxito
   */
  updateBranch(branchId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>>;

  /**
   * Elimina una sucursal
   * @param branchId - ID de la sucursal
   * @returns {status: 200, message: 'Success', data: null} en éxito
   */
  deleteBranch(branchId: number, setLoading?: SetStateFn): Promise<ApiResponse<null>>;
}
