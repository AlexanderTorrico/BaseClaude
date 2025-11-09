import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserModel } from '../models/UserModel';

export const useUsers = () => {
  const users = useSelector((state: RootState) => state.users.list);
  const currentView = useSelector((state: RootState) => state.users.currentView);

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
    findUserByEmail,
    findUserById,
    getTotalUsers,
  };
};
