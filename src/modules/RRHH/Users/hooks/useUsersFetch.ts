import { useState } from 'react';
import { store } from '@/store';
import { IUserService } from '../services/IUserService';
import { RegisterUserDto } from '../models/RegisterUserDto';
import { setUsers, addUser } from '../slices/userSlice';

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

  const registerUser = async (dto: RegisterUserDto): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('lastName', dto.lastName);
    formData.append('phone', dto.phone);
    formData.append('email', dto.email);
    formData.append('password', dto.password);
    formData.append('repeatPassword', dto.repeatPassword);
    formData.append('gbl_company_id', dto.gbl_company_id);

    if (dto.avatar) {
      formData.append('avatar', dto.avatar);
    }

    const result = await service.registerUser(formData, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error registering user: [${result.status}] ${result.message}`);
      return {
        success: false,
        message: result.message || 'Error al registrar el usuario',
      };
    }

    if (result.data) {
      store.dispatch(addUser(result.data));
    }

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
    };
  };

  return {
    loading,
    fetchUsersByCompany,
    registerUser,
  };
};
