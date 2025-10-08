import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserController } from '../controllers/UserController';
import { ControllerResponse } from '../models/ControllerResponse';
import { UserModel } from '../models/UserModel';

/**
 * Hook personalizado para manejar usuarios
 * - Lee del Redux (sync)
 * - Llama al Controller para operaciones async
 */
export const useUsers = () => {
  // Lectura del estado desde Redux (sincrónico)
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  // ==========================================
  // FUNCIONES ASÍNCRONAS (llaman al Controller)
  // ==========================================

  /**
   * Obtener usuarios por compañía
   */
  const fetchUsersByCompany = async (companyId: number): Promise<ControllerResponse<UserModel[]>> => {
    return await UserController.getUsersByCompany(companyId);
  };

  // ==========================================
  // FUNCIONES SÍNCRONAS (lógica de negocio local)
  // ==========================================

  /**
   * Buscar usuario por email (sincrónico)
   */
  const findUserByEmail = (email: string): UserModel | undefined => {
    return users.find(user => user.email === email);
  };

  /**
   * Obtener total de usuarios (sincrónico)
   */
  const getTotalUsers = (): number => {
    return users.length;
  };

  return {
    // Estado de Redux
    users,
    loading,
    error,

    // Funciones async (llaman al Controller)
    fetchUsersByCompany,

    // Funciones sync (lógica local)
    findUserByEmail,
    getTotalUsers
  };
};
