import { useState } from 'react';
import { store } from '@/store';
import { IUserService } from '../services/IUserService';
import { setUsers } from '../slices/userSlice';

export const useUsersFetch = (service: IUserService) => {
  const [loading, setLoading] = useState(false);

  const fetchUsersByCompany = async (companyId: number): Promise<void> => {
    const result = await service.getUsersByCompany(companyId, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching users: [${result.status}] ${result.message}`);
      return;
    }

    store.dispatch(setUsers(result.data));
  };

  return {
    loading,
    fetchUsersByCompany,
  };
};
