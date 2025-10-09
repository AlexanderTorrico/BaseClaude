import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserController } from '../controllers/UserController';
import { ControllerResponse } from '@/shared/controllers/ControllerResponse';
import { UserModel } from '../models/UserModel';

/**
 * Hook personalizado para manejar usuarios
 * - Lee del Redux (sync)
 * - Llama al Controller para operaciones async (con caché inteligente)
 * - La UI solo se comunica con este hook
 */
export const useUsers = () => {
  // Lectura del estado desde Redux (sincrónico)
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  // ==========================================
  // FUNCIONES ASÍNCRONAS (llaman al Controller con caché)
  // ==========================================

  /**
   * Obtener usuarios por compañía
   * Si ya hay datos en Redux, no hace la petición (caché)
   * Para forzar recarga, usar force: true
   */
  const fetchUsersByCompany = async (
    companyId: number,
    options?: { force?: boolean }
  ): Promise<ControllerResponse<UserModel[]>> => {
    // Si ya hay datos y no se fuerza la recarga, no hace nada
    if (users.length > 0 && !options?.force) {
      console.log('📦 Usando datos en caché (usuarios ya cargados)');
      return {
        loading: false,
        data: users,
        success: true
      };
    }

    // Si no hay datos o se fuerza, llama al Controller
    console.log('🌐 Llamando al Controller para obtener usuarios...');
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

  /**
   * Buscar usuario por ID (sincrónico)
   */
  const findUserById = (userId: number): UserModel | undefined => {
    return users.find(user => user.id === userId);
  };

  return {
    // Estado de Redux
    users,
    loading,
    error,

    // Funciones async (con caché inteligente)
    fetchUsersByCompany,

    // Funciones sync (lógica local)
    findUserByEmail,
    findUserById,
    getTotalUsers
  };
};
