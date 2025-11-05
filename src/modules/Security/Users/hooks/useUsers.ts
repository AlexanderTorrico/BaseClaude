import { useSelector } from 'react-redux';
import { RootState, store } from '@/store';
import { ServiceManager } from '@/shared/services/ServiceManager';
import { useServiceLoading } from '@/shared/hooks/useServiceManager';
import { IUserService } from '../services/IUserService';
import { UserMockService } from '../services/UserMockService';
import { setUsers } from '../slices/userSlice';
import { UserModel } from '../models/UserModel';

const defaultUserService = new UserMockService();

export const useUsers = (service: IUserService & ServiceManager = defaultUserService) => {
  // Lectura del estado desde Redux (sincrónico)
  const users = useSelector((state: RootState) => state.users.list);
  const currentView = useSelector((state: RootState) => state.users.currentView);

  
  const loading = useServiceLoading(service);

  const fetchUsersByCompany = async (
    companyId: number,
    options?: { force?: boolean }
  ): Promise<void> => {
    // Caché: si ya hay datos y no se fuerza, no hace petición
    if (users.length > 0 && !options?.force) {
      console.log('📦 Usando datos en caché (usuarios ya cargados)');
      return;
    }

    const result = await service.getUsersByCompany(companyId);
    if (result?.data) {
      store.dispatch(setUsers(result.data));
    }
  };

  // ==========================================
  // FUNCIONES SÍNCRONAS (helpers)
  // ==========================================

  const findUserByEmail = (email: string): UserModel | undefined => {
    return users.find(user => user.email === email);
  };

  const getTotalUsers = (): number => {
    return users.length;
  };

  const findUserById = (userId: number): UserModel | undefined => {
    return users.find(user => user.id === userId);
  };

  return {
    users,
    currentView,
    loading,

    fetchUsersByCompany,

    findUserByEmail,
    findUserById,
    getTotalUsers
  };
};
