import { useSelector } from 'react-redux';
import { RootState, store } from '@/store';
import { IUserService } from '../services/IUserService';
import { UserMockService } from '../services/UserMockService';
import { setUsers, setLoading, setError } from '../slices/userSlice';
import { ControllerResponse, createSuccessResponse, createErrorResponse } from '@/shared/controllers/ControllerResponse';
import { UserModel } from '../models/UserModel';

// Instancia compartida del service por defecto
const defaultUserService = new UserMockService();

/**
 * Hook personalizado para manejar usuarios
 * - Lee del Redux (sync)
 * - Usa inyección de dependencias para Services (Mock o API)
 * - Si no se pasa service, usa UserMockService por defecto
 */
export const useUsers = (userService: IUserService = defaultUserService) => {


  // Lectura del estado desde Redux (sincrónico)
  const users = useSelector((state: RootState) => state.users.list);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const currentView = useSelector((state: RootState) => state.users.currentView);

  // ==========================================
  // FUNCIONES ASÍNCRONAS (llaman al Service con caché)
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

    // Dispatch loading
    store.dispatch(setLoading(true));

    try {
      // Llamar al service
      const result = await userService.getUsersByCompany(companyId);

      // Guardar en Redux
      store.dispatch(setUsers(result.data));

      return createSuccessResponse(result.data);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error desconocido';
      store.dispatch(setError(errorMessage));

      return createErrorResponse(errorMessage);
    }
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
    currentView,

    // Funciones async (con caché inteligente)
    fetchUsersByCompany,

    // Funciones sync (lógica local)
    findUserByEmail,
    findUserById,
    getTotalUsers
  };
};
