import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, store } from '@/store';
import { IUserService } from '../services/IUserService';
import { setUsers } from '../slices/userSlice';
import { UserModel } from '../models/UserModel';
import { logServiceError } from '@/shared/services/ServiceResponse';

export const useUsers = (service: IUserService) => {
  const users = useSelector((state: RootState) => state.users.list);
  const currentView = useSelector((state: RootState) => state.users.currentView);

  const [loading, setLoading] = useState(false);

  const fetchUsersByCompany = async (companyId: number): Promise<void> => {
    console.log(`🔄 Fetching users for company ${companyId} using:`, service.constructor.name);
    const result = await service.getUsersByCompany(companyId, setLoading);

    if ('error' in result) {
      console.error('❌ Error fetching users:', result);
      logServiceError(result);
      return;
    }

    console.log(`✅ Successfully fetched ${result.data.length} users from API`);
    store.dispatch(setUsers(result.data));
  };

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
