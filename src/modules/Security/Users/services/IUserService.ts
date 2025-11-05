import { UserModel } from '../models/UserModel';

/**
 * Interface para el servicio de usuarios
 * Define el contrato que deben cumplir todas las implementaciones (API, Mock, etc.)
 */
export interface IUserService {
  /**
   * Obtiene usuarios por company_id
   * @param companyId - ID de la compañía
   * @returns Promise con objeto { data: UserModel[], loading: boolean }
   */
  getUsersByCompany(companyId: number): Promise<{ data: UserModel[], loading: boolean }>;
}
