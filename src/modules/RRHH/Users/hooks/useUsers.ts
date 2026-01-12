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

  /**
   * Busca un usuario por su UUID (identificador único principal)
   * @param uuid - UUID del usuario
   */
  const findUserByUuid = (uuid: string): UserModel | undefined => {
    return users.find(user => user.uuid === uuid);
  };

  return {
    users,
    currentView,
    findUserByEmail,
    findUserByUuid,
    getTotalUsers,
  };
};
