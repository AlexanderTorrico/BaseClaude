import { useState } from 'react';
import { store } from '@/store';
import { setUsers } from '@/modules/RRHH/Users/slices/userSlice';
import { IUserService } from '@/modules/RRHH/Users/services/IUserService';

export const useSharedUsersFetch = (service: IUserService) => {
  const [loading, setLoading] = useState(false);

  const usersLoaded = (): boolean => {
    const state = store.getState();
    return state.users.list.length > 0;
  };

  const fetchUsers = async (companyId: number = 1): Promise<void> => {
    // Si ya hay usuarios cargados, no volver a cargar
    if (usersLoaded()) {
      return;
    }

    const result = await service.getUsersByCompany(companyId, setLoading);
    store.dispatch(setUsers(result.data));
  };

  // Forzar recarga de usuarios
  const forceRefreshUsers = async (companyId: number = 1): Promise<void> => {
    const result = await service.getUsersByCompany(companyId, setLoading);
    store.dispatch(setUsers(result.data));
  };

  return {
    loading,
    fetchUsers,
    forceRefreshUsers,
    usersLoaded: usersLoaded(),
  };
};
